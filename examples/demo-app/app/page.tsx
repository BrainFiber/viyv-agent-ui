import Link from 'next/link';
import { pageStore } from '@/lib/agent-ui-config';
import { ensureSeeded } from '@/lib/seed';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
	await ensureSeeded();
	const pages = await pageStore.list();

	return (
		<div className="space-y-10">
			{/* Page list */}
			<section>
				<h1 className="text-2xl font-bold tracking-tight">ページ一覧</h1>
				<p className="mt-1 text-sm text-fg-muted">
					固定デモページと、API 経由で動的に作成されたページが表示されます。
				</p>

				<div className="mt-6 grid gap-4 sm:grid-cols-2">
					{pages.map((page) => (
						<Link
							key={page.id}
							href={`/pages/${page.id}`}
							className="group rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:border-primary-soft-border hover:shadow-md"
						>
							<h2 className="font-semibold text-fg group-hover:text-primary">
								{page.spec.title}
							</h2>
							{page.spec.description && (
								<p className="mt-1 text-sm text-fg-muted line-clamp-2">
									{page.spec.description}
								</p>
							)}
							<div className="mt-3 flex items-center gap-2">
								<span className="rounded-md bg-muted px-2 py-0.5 text-xs text-fg-muted">
									{page.id}
								</span>
								{page.spec.meta?.tags?.map((tag) => (
									<span
										key={tag}
										className="rounded-md bg-primary-soft px-2 py-0.5 text-xs text-primary-soft-fg"
									>
										{tag}
									</span>
								))}
							</div>
						</Link>
					))}
				</div>

				{pages.length === 0 && (
					<p className="mt-6 text-center text-sm text-fg-subtle">
						ページがありません。API 経由で作成してください。
					</p>
				)}
			</section>

			{/* API usage guide */}
			<section className="rounded-xl border border-border bg-surface p-6 shadow-sm">
				<h2 className="text-lg font-semibold tracking-tight">動的ページ作成</h2>
				<p className="mt-1 text-sm text-fg-muted">
					API を使って新しいページを作成できます。
				</p>

				<div className="mt-4 space-y-4">
					<div>
						<h3 className="text-sm font-medium text-fg-secondary">1. ページを作成</h3>
						<pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
{`curl -X POST http://localhost:3100/api/agent-ui/pages \\
  -H 'Content-Type: application/json' \\
  -d '{
    "id": "hello",
    "title": "Hello World",
    "root": "r",
    "hooks": {},
    "elements": {
      "r": {
        "type": "Header",
        "props": { "title": "Hello, World!" }
      }
    },
    "state": {},
    "actions": {}
  }'`}
						</pre>
					</div>

					<div>
						<h3 className="text-sm font-medium text-fg-secondary">2. ブラウザで確認</h3>
						<p className="mt-1 text-sm text-fg-muted">
							作成後、{' '}
							<code className="rounded-md bg-muted px-1.5 py-0.5 text-xs">
								/pages/hello
							</code>{' '}
							にアクセスするとページが表示されます。
						</p>
					</div>

					<div>
						<h3 className="text-sm font-medium text-fg-secondary">3. プレビュー (一時保存)</h3>
						<pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
{`curl -X POST http://localhost:3100/api/agent-ui/pages/preview \\
  -H 'Content-Type: application/json' \\
  -d '{ ... PageSpec JSON ... }'
# → { "previewId": "abc123", "expiresAt": "..." }
# → /preview/abc123 で確認 (30分有効)`}
						</pre>
					</div>
				</div>
			</section>
		</div>
	);
}

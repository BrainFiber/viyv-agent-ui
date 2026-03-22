'use client';

import { use } from 'react';
import { PageRenderer } from '@viyv/agent-ui-react';
import { defaultRegistry } from '@viyv/agent-ui-components';

function LoadingSkeleton() {
	return (
		<div className="animate-pulse space-y-4">
			<div className="h-8 w-1/3 rounded bg-muted-strong" />
			<div className="h-64 rounded bg-muted-strong" />
		</div>
	);
}

function ErrorDisplay({ error }: { error: Error }) {
	return (
		<div className="rounded-lg border border-danger-soft-border bg-danger-soft p-6">
			<h2 className="text-lg font-semibold text-danger-soft-fg">プレビューの読み込みに失敗しました</h2>
			<p className="mt-2 text-sm text-danger">{error.message}</p>
		</div>
	);
}

export default function PreviewPage({ params }: { params: Promise<{ previewId: string }> }) {
	const { previewId } = use(params);

	return (
		<div>
			<div className="mb-6 rounded-lg border border-warning-soft-border bg-warning-soft px-4 py-3">
				<p className="text-sm font-medium text-warning-soft-fg">
					プレビューモード — このプレビューは30分で期限切れになります。
				</p>
			</div>

			<PageRenderer
				previewId={previewId}
				queryEndpoint="/api/agent-ui"
				registry={defaultRegistry}
				loading={<LoadingSkeleton />}
				error={ErrorDisplay}
			/>
		</div>
	);
}

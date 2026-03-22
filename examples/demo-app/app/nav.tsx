'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Nav() {
	const pathname = usePathname();
	const isHome = pathname === '/';

	return (
		<nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6">
				<Link href="/" className="flex items-center gap-2 font-semibold text-fg">
					<span className="text-lg">agent-ui</span>
					<span className="rounded bg-primary-soft px-1.5 py-0.5 text-xs text-primary-soft-fg">demo</span>
				</Link>
				{!isHome && (
					<Link
						href="/"
						className="ml-auto text-sm text-fg-muted hover:text-fg transition-colors"
					>
						&larr; ページ一覧
					</Link>
				)}
			</div>
		</nav>
	);
}

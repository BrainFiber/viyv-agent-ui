'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Nav() {
	const pathname = usePathname();
	const isHome = pathname === '/';

	return (
		<nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
			<div className="mx-auto flex h-14 max-w-5xl items-center gap-4 px-6">
				<Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
					<span className="text-lg">agent-ui</span>
					<span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">demo</span>
				</Link>
				{!isHome && (
					<Link
						href="/"
						className="ml-auto text-sm text-gray-500 hover:text-gray-900 transition-colors"
					>
						&larr; ページ一覧
					</Link>
				)}
			</div>
		</nav>
	);
}

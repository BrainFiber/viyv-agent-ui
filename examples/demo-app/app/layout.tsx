import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { Nav } from './nav';
import './globals.css';

export const metadata: Metadata = {
	title: 'agent-ui Demo',
	description: '@viyv/agent-ui デモアプリケーション',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="ja">
			<body className="min-h-screen bg-surface-alt text-fg antialiased selection:bg-primary/20">
				<Providers>
					<Nav />
					<main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
				</Providers>
			</body>
		</html>
	);
}

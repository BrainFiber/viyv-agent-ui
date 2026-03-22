import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import type { PageSpec } from '@viyv/agent-ui-schema';
import { afterEach, describe, expect, it } from 'vitest';
import { ElementRenderer } from '../element-renderer.js';
import { HookDataProvider } from '../providers/hook-data-provider.js';
import { InteractionProvider } from '../providers/interaction-provider.js';
import { PageProvider } from '../providers/page-provider.js';
import { defineRegistry } from '../registry.js';

const TestText = ({ content }: { content?: string; children?: React.ReactNode }) => (
	<span data-testid="test-text">{content}</span>
);

const registry = defineRegistry({
	Text: TestText as React.ComponentType<Record<string, unknown>>,
});

function renderWithProviders(elementId: string, spec: PageSpec) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return render(
		<QueryClientProvider client={queryClient}>
			<PageProvider spec={spec} registry={registry} queryEndpoint="/api/agent-ui">
				<HookDataProvider spec={spec} queryEndpoint="/api/agent-ui">
					<InteractionProvider spec={spec}>
						<ElementRenderer elementId={elementId} />
					</InteractionProvider>
				</HookDataProvider>
			</PageProvider>
		</QueryClientProvider>,
	);
}

describe('FeedRenderer', () => {
	afterEach(cleanup);

	const baseFeedSpec = (items: unknown[], options?: { divider?: boolean; emptyMessage?: string }): PageSpec => ({
		id: 'test',
		title: 'Test',
		root: 'feed',
		elements: {
			feed: {
				type: 'Feed',
				props: {
					data: '$hook.items',
					keyField: 'id',
					labelKey: 'title',
					...(options?.divider !== undefined ? { divider: options.divider } : {}),
					...(options?.emptyMessage ? { emptyMessage: options.emptyMessage } : {}),
				},
				children: ['itemText'],
			},
			itemText: {
				type: 'Text',
				props: { content: '$item.title' },
			},
		},
		hooks: {
			items: { use: 'useState', params: { initial: items } },
		},
		state: {},
		actions: {},
	});

	it('renders feed with role="feed"', () => {
		const spec = baseFeedSpec([
			{ id: '1', title: 'Post A' },
			{ id: '2', title: 'Post B' },
		]);
		renderWithProviders('feed', spec);
		expect(screen.getByRole('feed')).toBeTruthy();
	});

	it('renders articles with aria-posinset and aria-setsize', () => {
		const spec = baseFeedSpec([
			{ id: '1', title: 'First' },
			{ id: '2', title: 'Second' },
		]);
		renderWithProviders('feed', spec);
		const articles = screen.getAllByRole('article');
		expect(articles).toHaveLength(2);
		expect(articles[0].getAttribute('aria-posinset')).toBe('1');
		expect(articles[0].getAttribute('aria-setsize')).toBe('2');
		expect(articles[1].getAttribute('aria-posinset')).toBe('2');
	});

	it('shows empty state message', () => {
		const spec = baseFeedSpec([], { emptyMessage: 'No posts yet' });
		renderWithProviders('feed', spec);
		expect(screen.getByText('No posts yet')).toBeTruthy();
	});

	it('shows default empty state message', () => {
		const spec = baseFeedSpec([]);
		renderWithProviders('feed', spec);
		expect(screen.getByText('データがありません')).toBeTruthy();
	});

	it('renders item content via $item expression', () => {
		const spec = baseFeedSpec([
			{ id: '1', title: 'Hello' },
		]);
		renderWithProviders('feed', spec);
		expect(screen.getByText('Hello')).toBeTruthy();
	});
});

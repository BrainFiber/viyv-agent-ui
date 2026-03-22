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

describe('TimelineRenderer', () => {
	afterEach(cleanup);

	const baseTimelineSpec = (items: unknown[], options?: { timestampKey?: string; emptyMessage?: string }): PageSpec => ({
		id: 'test',
		title: 'Test',
		root: 'timeline',
		elements: {
			timeline: {
				type: 'Timeline',
				props: {
					data: '$hook.events',
					keyField: 'id',
					labelKey: 'title',
					...(options?.timestampKey ? { timestampKey: options.timestampKey } : {}),
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
			events: { use: 'useState', params: { initial: items } },
		},
		state: {},
		actions: {},
	});

	it('renders timeline with role="list"', () => {
		const spec = baseTimelineSpec([
			{ id: '1', title: 'Event A' },
			{ id: '2', title: 'Event B' },
		]);
		renderWithProviders('timeline', spec);
		expect(screen.getByRole('list')).toBeTruthy();
	});

	it('renders items with role="listitem"', () => {
		const spec = baseTimelineSpec([
			{ id: '1', title: 'First' },
			{ id: '2', title: 'Second' },
		]);
		renderWithProviders('timeline', spec);
		const items = screen.getAllByRole('listitem');
		expect(items).toHaveLength(2);
	});

	it('sets aria-label on items from labelKey', () => {
		const spec = baseTimelineSpec([
			{ id: '1', title: 'Launch' },
		]);
		renderWithProviders('timeline', spec);
		const item = screen.getByRole('listitem');
		expect(item.getAttribute('aria-label')).toBe('Launch');
	});

	it('shows empty state', () => {
		const spec = baseTimelineSpec([], { emptyMessage: 'No events' });
		renderWithProviders('timeline', spec);
		expect(screen.getByText('No events')).toBeTruthy();
	});

	it('renders timestamp when timestampKey is set', () => {
		const spec = baseTimelineSpec(
			[{ id: '1', title: 'Event', time: '2024-01-01' }],
			{ timestampKey: 'time' },
		);
		renderWithProviders('timeline', spec);
		expect(screen.getByText('2024-01-01')).toBeTruthy();
	});
});

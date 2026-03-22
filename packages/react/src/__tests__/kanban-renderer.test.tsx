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

describe('KanbanRenderer', () => {
	afterEach(cleanup);

	const baseKanbanSpec = (items: unknown[], options?: { columns?: Array<{ value: string; label: string }>; emptyMessage?: string }): PageSpec => ({
		id: 'test',
		title: 'Test',
		root: 'kanban',
		elements: {
			kanban: {
				type: 'KanbanBoard',
				props: {
					data: '$hook.tasks',
					groupKey: 'status',
					keyField: 'id',
					...(options?.columns ? { columns: options.columns } : {}),
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
			tasks: { use: 'useState', params: { initial: items } },
		},
		state: {},
		actions: {},
	});

	it('renders kanban with role="region" and aria-label', () => {
		const spec = baseKanbanSpec([
			{ id: '1', title: 'Task A', status: 'todo' },
		]);
		renderWithProviders('kanban', spec);
		const region = screen.getByRole('region', { name: 'Kanban Board' });
		expect(region).toBeTruthy();
	});

	it('groups items into columns', () => {
		const spec = baseKanbanSpec(
			[
				{ id: '1', title: 'Task A', status: 'todo' },
				{ id: '2', title: 'Task B', status: 'done' },
				{ id: '3', title: 'Task C', status: 'todo' },
			],
			{ columns: [{ value: 'todo', label: 'To Do' }, { value: 'done', label: 'Done' }] },
		);
		renderWithProviders('kanban', spec);
		// Check that items are rendered
		const texts = screen.getAllByTestId('test-text');
		expect(texts).toHaveLength(3);
	});

	it('shows empty state when no items', () => {
		const spec = baseKanbanSpec([], { emptyMessage: 'No tasks' });
		renderWithProviders('kanban', spec);
		expect(screen.getByText('No tasks')).toBeTruthy();
	});

	it('renders item content via $item expression', () => {
		const spec = baseKanbanSpec([
			{ id: '1', title: 'My Task', status: 'todo' },
		]);
		renderWithProviders('kanban', spec);
		expect(screen.getByText('My Task')).toBeTruthy();
	});
});

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, within } from '@testing-library/react';
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

const TestStack = ({ children, direction }: { children?: React.ReactNode; direction?: string }) => (
	<div data-testid="test-stack" data-direction={direction}>
		{children}
	</div>
);

const TestGrid = ({ children }: { children?: React.ReactNode }) => (
	<div data-testid="test-grid">{children}</div>
);

const TestCard = ({ children, title }: { children?: React.ReactNode; title?: string }) => (
	<div data-testid="test-card" data-title={title}>
		{children}
	</div>
);

const registry = defineRegistry({
	Text: TestText as React.ComponentType<Record<string, unknown>>,
	Stack: TestStack as React.ComponentType<Record<string, unknown>>,
	Grid: TestGrid as React.ComponentType<Record<string, unknown>>,
	Card: TestCard as React.ComponentType<Record<string, unknown>>,
});

const spec: PageSpec = {
	id: 'test',
	title: 'Test',
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { direction: 'vertical' },
			children: ['text1'],
		},
		text1: {
			type: 'Text',
			props: { content: 'Hello World' },
		},
	},
	hooks: {},
	state: {},
	actions: {},
};

function renderWithProviders(elementId: string, overrideSpec?: PageSpec) {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	const s = overrideSpec ?? spec;
	return render(
		<QueryClientProvider client={queryClient}>
			<PageProvider spec={s} registry={registry} queryEndpoint="/api/agent-ui">
				<HookDataProvider spec={s} queryEndpoint="/api/agent-ui">
					<InteractionProvider spec={s}>
						<ElementRenderer elementId={elementId} />
					</InteractionProvider>
				</HookDataProvider>
			</PageProvider>
		</QueryClientProvider>,
	);
}

describe('ElementRenderer', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders a simple element', () => {
		renderWithProviders('text1');
		expect(screen.getByTestId('test-text')).toHaveTextContent('Hello World');
	});

	it('renders nested elements', () => {
		renderWithProviders('root');
		const stack = screen.getByTestId('test-stack');
		expect(stack).toBeTruthy();
		expect(within(stack).getByTestId('test-text')).toHaveTextContent('Hello World');
	});

	it('returns null for missing element', () => {
		const { container } = renderWithProviders('nonexistent');
		expect(container.innerHTML).toBe('');
	});
});

describe('Repeater', () => {
	afterEach(() => {
		cleanup();
	});

	it('renders children for each data item', () => {
		const repeaterSpec: PageSpec = {
			id: 'test',
			title: 'Test',
			root: 'repeater',
			elements: {
				repeater: {
					type: 'Repeater',
					props: { data: '$hook.items' },
					children: ['itemText'],
				},
				itemText: {
					type: 'Text',
					props: { content: '$item.name' },
				},
			},
			hooks: {
				items: { use: 'useState', params: { initial: [{ name: 'A' }, { name: 'B' }, { name: 'C' }] } },
			},
			state: {},
			actions: {},
		};
		renderWithProviders('repeater', repeaterSpec);
		const texts = screen.getAllByTestId('test-text');
		expect(texts).toHaveLength(3);
		expect(texts[0]).toHaveTextContent('A');
		expect(texts[1]).toHaveTextContent('B');
		expect(texts[2]).toHaveTextContent('C');
	});

	it('renders nothing for empty array', () => {
		const repeaterSpec: PageSpec = {
			id: 'test',
			title: 'Test',
			root: 'repeater',
			elements: {
				repeater: {
					type: 'Repeater',
					props: { data: '$hook.items' },
					children: ['itemText'],
				},
				itemText: {
					type: 'Text',
					props: { content: '$item.name' },
				},
			},
			hooks: {
				items: { use: 'useState', params: { initial: [] } },
			},
			state: {},
			actions: {},
		};
		const { container } = renderWithProviders('repeater', repeaterSpec);
		expect(container.innerHTML).toBe('');
	});

	it('renders nothing for non-array data', () => {
		const repeaterSpec: PageSpec = {
			id: 'test',
			title: 'Test',
			root: 'repeater',
			elements: {
				repeater: {
					type: 'Repeater',
					props: { data: 'not-an-array' },
					children: ['itemText'],
				},
				itemText: {
					type: 'Text',
					props: { content: '$item.name' },
				},
			},
			hooks: {},
			state: {},
			actions: {},
		};
		const { container } = renderWithProviders('repeater', repeaterSpec);
		expect(container.innerHTML).toBe('');
	});

	it('does not add wrapper element (Grid > Repeater > Card)', () => {
		const repeaterSpec: PageSpec = {
			id: 'test',
			title: 'Test',
			root: 'grid',
			elements: {
				grid: {
					type: 'Grid',
					props: {},
					children: ['repeater'],
				},
				repeater: {
					type: 'Repeater',
					props: { data: '$hook.items' },
					children: ['card'],
				},
				card: {
					type: 'Card',
					props: { title: '$item.title' },
				},
			},
			hooks: {
				items: { use: 'useState', params: { initial: [{ title: 'X' }, { title: 'Y' }] } },
			},
			state: {},
			actions: {},
		};
		renderWithProviders('grid', repeaterSpec);
		const grid = screen.getByTestId('test-grid');
		const cards = within(grid).getAllByTestId('test-card');
		expect(cards).toHaveLength(2);
		// Cards should be direct children of grid (no wrapper div)
		expect(cards[0].parentElement).toBe(grid);
	});
});

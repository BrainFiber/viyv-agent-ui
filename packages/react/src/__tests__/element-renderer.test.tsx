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

const registry = defineRegistry({
	Text: TestText as React.ComponentType<Record<string, unknown>>,
	Stack: TestStack as React.ComponentType<Record<string, unknown>>,
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

function renderWithProviders(elementId: string) {
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

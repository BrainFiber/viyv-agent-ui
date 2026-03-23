import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Accordion } from '../layout/accordion.js';
import { Stack } from '../layout/stack.js';
import { Tabs } from '../layout/tabs.js';

afterEach(cleanup);

describe('Stack', () => {
	it('renders children', () => {
		render(
			<Stack>
				<div>Child</div>
			</Stack>,
		);
		expect(screen.getByText('Child')).toBeTruthy();
	});

	it('applies align="start"', () => {
		const { container } = render(
			<Stack align="start">
				<div>A</div>
			</Stack>,
		);
		expect(container.firstElementChild?.className).toContain('items-start');
	});

	it('applies justify="between"', () => {
		const { container } = render(
			<Stack justify="between">
				<div>A</div>
			</Stack>,
		);
		expect(container.firstElementChild?.className).toContain('justify-between');
	});

	it('applies wrap', () => {
		const { container } = render(
			<Stack wrap>
				<div>A</div>
			</Stack>,
		);
		expect(container.firstElementChild?.className).toContain('flex-wrap');
	});

	it('does not add alignment classes when props are omitted', () => {
		const { container } = render(
			<Stack>
				<div>A</div>
			</Stack>,
		);
		const className = container.firstElementChild?.className ?? '';
		expect(className).not.toContain('items-');
		expect(className).not.toContain('justify-');
		expect(className).not.toContain('flex-wrap');
	});
});

describe('Tabs', () => {
	const tabs = [
		{ id: 'tab1', label: 'First' },
		{ id: 'tab2', label: 'Second' },
		{ id: 'tab3', label: 'Third' },
	];

	it('renders tab buttons', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
				<div>Content 2</div>
				<div>Content 3</div>
			</Tabs>,
		);
		expect(screen.getByText('First')).toBeTruthy();
		expect(screen.getByText('Second')).toBeTruthy();
		expect(screen.getByText('Third')).toBeTruthy();
	});

	it('shows first tab content by default', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
				<div>Content 2</div>
				<div>Content 3</div>
			</Tabs>,
		);
		expect(screen.getByText('Content 1')).toBeTruthy();
		// Radix hides inactive tab content so it's not accessible
		expect(screen.queryByText('Content 2')).toBeNull();
	});

	it('switches tab on click', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
				<div>Content 2</div>
				<div>Content 3</div>
			</Tabs>,
		);
		// Radix Tabs activates on mouseDown (not click)
		fireEvent.mouseDown(screen.getByText('Second'));
		expect(screen.queryByText('Content 1')).toBeNull();
		expect(screen.getByText('Content 2')).toBeTruthy();
	});

	it('sets aria-selected on active tab', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
				<div>Content 2</div>
			</Tabs>,
		);
		expect(screen.getByText('First').getAttribute('aria-selected')).toBe('true');
		expect(screen.getByText('Second').getAttribute('aria-selected')).toBe('false');

		fireEvent.mouseDown(screen.getByText('Second'));
		expect(screen.getByText('First').getAttribute('aria-selected')).toBe('false');
		expect(screen.getByText('Second').getAttribute('aria-selected')).toBe('true');
	});

	it('links tabpanel to active tab via aria-labelledby', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
				<div>Content 2</div>
			</Tabs>,
		);
		const panel = screen.getByRole('tabpanel');
		const firstTab = screen.getByText('First');
		expect(panel.getAttribute('aria-labelledby')).toBe(firstTab.id);

		fireEvent.mouseDown(screen.getByText('Second'));
		const newPanel = screen.getByRole('tabpanel');
		const secondTab = screen.getByText('Second');
		expect(newPanel.getAttribute('aria-labelledby')).toBe(secondTab.id);
	});

	it('tab buttons have role="tab"', () => {
		render(
			<Tabs tabs={tabs}>
				<div>Content 1</div>
			</Tabs>,
		);
		const tabButtons = screen.getAllByRole('tab');
		expect(tabButtons.length).toBe(tabs.length);
	});
});

describe('Accordion', () => {
	const panels = [
		{ id: 'a', title: 'Section A' },
		{ id: 'b', title: 'Section B' },
	];

	it('renders panel titles as buttons', () => {
		render(
			<Accordion panels={panels}>
				<div>Content A</div>
				<div>Content B</div>
			</Accordion>,
		);
		expect(screen.getByText('Section A')).toBeTruthy();
		expect(screen.getByText('Section B')).toBeTruthy();
	});

	it('panels start collapsed by default', () => {
		render(
			<Accordion panels={panels}>
				<div>Content A</div>
				<div>Content B</div>
			</Accordion>,
		);
		expect(screen.queryByText('Content A')).toBeNull();
		expect(screen.queryByText('Content B')).toBeNull();
	});

	it('expands panel on click', () => {
		render(
			<Accordion panels={panels}>
				<div>Content A</div>
				<div>Content B</div>
			</Accordion>,
		);
		fireEvent.click(screen.getByText('Section A'));
		expect(screen.getByText('Content A')).toBeTruthy();
		expect(screen.queryByText('Content B')).toBeNull();
	});

	it('sets aria-expanded on buttons', () => {
		render(
			<Accordion panels={panels}>
				<div>Content A</div>
				<div>Content B</div>
			</Accordion>,
		);
		const triggerA = screen.getByText('Section A').closest('button')!;
		expect(triggerA.getAttribute('aria-expanded')).toBe('false');
		fireEvent.click(triggerA);
		expect(triggerA.getAttribute('aria-expanded')).toBe('true');
	});

	it('supports defaultOpen', () => {
		render(
			<Accordion panels={panels} defaultOpen={['b']}>
				<div>Content A</div>
				<div>Content B</div>
			</Accordion>,
		);
		expect(screen.queryByText('Content A')).toBeNull();
		expect(screen.getByText('Content B')).toBeTruthy();
	});

	it('accordion mode: only one panel open at a time', () => {
		render(
			<Accordion panels={panels} accordion>
				<div>Content A</div>
				<div>Content B</div>
			</Accordion>,
		);
		fireEvent.click(screen.getByText('Section A'));
		expect(screen.getByText('Content A')).toBeTruthy();
		fireEvent.click(screen.getByText('Section B'));
		expect(screen.queryByText('Content A')).toBeNull();
		expect(screen.getByText('Content B')).toBeTruthy();
	});

	it('has role="region" on expanded panel', () => {
		render(
			<Accordion panels={panels}>
				<div>Content A</div>
			</Accordion>,
		);
		fireEvent.click(screen.getByText('Section A'));
		expect(screen.getByRole('region')).toBeTruthy();
	});
});

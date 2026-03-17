import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { TreeList } from '../data/tree-list.js';

afterEach(cleanup);

const sampleData = [
	{
		id: '1',
		label: 'Root A',
		children: [
			{ id: '1-1', label: 'Child A1', children: [] },
			{ id: '1-2', label: 'Child A2', children: [] },
		],
	},
	{
		id: '2',
		label: 'Root B',
		children: [{ id: '2-1', label: 'Child B1', children: [] }],
	},
];

describe('TreeList', () => {
	it('renders tree structure', () => {
		render(<TreeList data={sampleData} />);
		expect(screen.getByText('Root A')).toBeTruthy();
		expect(screen.getByText('Root B')).toBeTruthy();
	});

	it('expands/collapses nodes on click', () => {
		render(<TreeList data={sampleData} />);
		// Children should not be visible initially
		expect(screen.queryByText('Child A1')).toBeNull();

		// Click expand button
		fireEvent.click(screen.getByLabelText('Expand Root A'));
		expect(screen.getByText('Child A1')).toBeTruthy();
		expect(screen.getByText('Child A2')).toBeTruthy();

		// Click collapse button
		fireEvent.click(screen.getByLabelText('Collapse Root A'));
		expect(screen.queryByText('Child A1')).toBeNull();
	});

	it('respects defaultExpanded', () => {
		render(<TreeList data={sampleData} defaultExpanded />);
		expect(screen.getByText('Child A1')).toBeTruthy();
		expect(screen.getByText('Child B1')).toBeTruthy();
	});

	it('uses custom labelKey and childrenKey', () => {
		const customData = [
			{
				id: 'x',
				name: 'Custom Root',
				items: [{ id: 'x1', name: 'Custom Child', items: [] }],
			},
		];
		render(<TreeList data={customData} labelKey="name" childrenKey="items" defaultExpanded />);
		expect(screen.getByText('Custom Root')).toBeTruthy();
		expect(screen.getByText('Custom Child')).toBeTruthy();
	});

	it('has tree and treeitem roles', () => {
		render(<TreeList data={sampleData} />);
		expect(screen.getByRole('tree')).toBeTruthy();
		const items = screen.getAllByRole('treeitem');
		expect(items.length).toBe(2); // Only root nodes visible initially
	});

	it('handles empty data', () => {
		render(<TreeList data={[]} />);
		const tree = screen.getByRole('tree');
		expect(tree).toBeTruthy();
		expect(tree.children.length).toBe(0);
	});

	it('handles { rows } wrapper', () => {
		render(<TreeList data={{ rows: sampleData }} />);
		expect(screen.getByText('Root A')).toBeTruthy();
		expect(screen.getByText('Root B')).toBeTruthy();
	});

	it('renders leaf nodes without toggle', () => {
		render(<TreeList data={sampleData} defaultExpanded />);
		// Leaf nodes show bullet marker, no expand button
		const items = screen.getAllByRole('treeitem');
		// Find leaf nodes - they should NOT have aria-expanded.
		// Leaf nodes don't contain nested treeitems. We filter by items
		// that don't contain child treeitems within them.
		const leafItems = items.filter(
			(el) => el.querySelector('[role="treeitem"]') === null,
		);
		expect(leafItems.length).toBeGreaterThan(0);
		for (const leaf of leafItems) {
			expect(leaf.getAttribute('aria-expanded')).toBeNull();
		}
	});
});

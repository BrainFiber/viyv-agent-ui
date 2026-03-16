import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DataTable } from '../data/data-table.js';

afterEach(cleanup);

describe('DataTable', () => {
	const columns = [
		{ key: 'name', label: 'Name', sortable: true },
		{ key: 'amount', label: 'Amount', format: 'currency' },
	];

	const data = [
		{ name: 'Widget', amount: 100 },
		{ name: 'Gadget', amount: 200 },
	];

	it('renders table headers', () => {
		render(<DataTable data={data} columns={columns} />);
		expect(screen.getByText('Name')).toBeTruthy();
		expect(screen.getByText('Amount')).toBeTruthy();
	});

	it('renders data rows', () => {
		render(<DataTable data={data} columns={columns} />);
		expect(screen.getByText('Widget')).toBeTruthy();
		expect(screen.getByText('Gadget')).toBeTruthy();
	});

	it('shows empty state when no data', () => {
		render(<DataTable data={[]} columns={columns} />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('handles non-array data gracefully', () => {
		render(<DataTable data={null} columns={columns} />);
		expect(screen.getByText('No data')).toBeTruthy();
	});

	it('shows custom empty message', () => {
		render(<DataTable data={[]} columns={columns} emptyMessage="データがありません" />);
		expect(screen.getByText('データがありません')).toBeTruthy();
	});

	it('uses keyField for row keys', () => {
		const dataWithId = [
			{ id: 'a', name: 'Widget', amount: 100 },
			{ id: 'b', name: 'Gadget', amount: 200 },
		];
		const { container } = render(
			<DataTable data={dataWithId} columns={columns} keyField="id" />,
		);
		const rows = container.querySelectorAll('tbody tr');
		expect(rows.length).toBe(2);
	});

	describe('rowHref', () => {
		it('renders anchor tags in cells when rowHref is set', () => {
			const dataWithId = [{ id: 1, name: 'Widget', amount: 100 }];
			const { container } = render(
				<DataTable
					data={dataWithId}
					columns={columns}
					rowHref="/pages/task-{{id}}"
					keyField="id"
				/>,
			);
			const anchors = container.querySelectorAll('a[href]');
			expect(anchors.length).toBe(2); // one per column
			expect(anchors[0].getAttribute('href')).toBe('/pages/task-1');
		});

		it('encodes special characters in href', () => {
			const dataWithId = [{ id: 'hello world', name: 'Test', amount: 0 }];
			const { container } = render(
				<DataTable
					data={dataWithId}
					columns={columns}
					rowHref="/pages/{{id}}"
					keyField="id"
				/>,
			);
			const anchor = container.querySelector('a[href]');
			expect(anchor?.getAttribute('href')).toBe('/pages/hello%20world');
		});

		it('adds cursor-pointer class to rows', () => {
			const dataWithId = [{ id: 1, name: 'Widget', amount: 100 }];
			const { container } = render(
				<DataTable
					data={dataWithId}
					columns={columns}
					rowHref="/pages/{{id}}"
				/>,
			);
			const row = container.querySelector('tbody tr');
			expect(row?.className).toContain('cursor-pointer');
		});
	});

	describe('onRowClick', () => {
		it('calls onRowClick when a row is clicked', () => {
			const handler = vi.fn();
			const { container } = render(
				<DataTable data={data} columns={columns} onRowClick={handler} />,
			);
			const row = container.querySelector('tbody tr');
			fireEvent.click(row!);
			expect(handler).toHaveBeenCalledWith(data[0]);
		});

		it('also fires onRowClick when rowHref is set', () => {
			const handler = vi.fn();
			const dataWithId = [{ id: 1, name: 'Widget', amount: 100 }];
			const { container } = render(
				<DataTable
					data={dataWithId}
					columns={columns}
					rowHref="/pages/{{id}}"
					onRowClick={handler}
				/>,
			);
			const row = container.querySelector('tbody tr');
			fireEvent.click(row!);
			expect(handler).toHaveBeenCalledWith(dataWithId[0]);
		});
	});

	describe('formatCell', () => {
		it('formats number', () => {
			const cols = [{ key: 'val', label: 'Value', format: 'number' }];
			render(<DataTable data={[{ val: 1234567 }]} columns={cols} />);
			expect(screen.getByText('1,234,567')).toBeTruthy();
		});

		it('formats percent', () => {
			const cols = [{ key: 'val', label: 'Value', format: 'percent' }];
			render(<DataTable data={[{ val: 0.856 }]} columns={cols} />);
			const cell = screen.getByRole('cell');
			expect(cell.textContent).toContain('%');
		});

		it('treats empty string as empty', () => {
			const cols = [{ key: 'val', label: 'Value', format: 'number' }];
			render(<DataTable data={[{ val: '' }]} columns={cols} />);
			const cell = screen.getByRole('cell');
			expect(cell.textContent).toBe('');
		});

		it('formats date', () => {
			const cols = [{ key: 'val', label: 'Value', format: 'date' }];
			render(<DataTable data={[{ val: '2026-01-15' }]} columns={cols} />);
			// ja-JP date format
			const cell = screen.getByRole('cell');
			expect(cell.textContent).toBeTruthy();
			expect(cell.textContent).toContain('2026');
		});
	});
});

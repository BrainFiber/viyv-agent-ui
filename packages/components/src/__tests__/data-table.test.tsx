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

	describe('filter', () => {
		const filterColumns = [
			{ key: 'name', label: 'Name', sortable: true, filter: { type: 'text' as const, placeholder: 'Search...' } },
			{
				key: 'status',
				label: 'Status',
				sortable: true,
				filter: {
					type: 'select' as const,
					options: [
						{ value: 'active', label: 'Active' },
						{ value: 'inactive', label: 'Inactive' },
					],
				},
			},
			{ key: 'amount', label: 'Amount', format: 'currency' },
		];

		const filterData = [
			{ name: 'Widget Alpha', status: 'active', amount: 100 },
			{ name: 'Gadget Beta', status: 'inactive', amount: 200 },
			{ name: 'Widget Gamma', status: 'active', amount: 300 },
		];

		it('does not render filter row when no columns have filter', () => {
			const { container } = render(<DataTable data={data} columns={columns} />);
			const theadRows = container.querySelectorAll('thead tr');
			expect(theadRows.length).toBe(1);
		});

		it('renders filter row when columns have filter config', () => {
			const { container } = render(<DataTable data={filterData} columns={filterColumns} />);
			const theadRows = container.querySelectorAll('thead tr');
			expect(theadRows.length).toBe(2);
		});

		it('filters rows by text input', () => {
			const { container } = render(<DataTable data={filterData} columns={filterColumns} />);
			const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
			fireEvent.change(textInput, { target: { value: 'Widget' } });
			const bodyRows = container.querySelectorAll('tbody tr');
			expect(bodyRows.length).toBe(2);
			expect(screen.getByText('Widget Alpha')).toBeTruthy();
			expect(screen.getByText('Widget Gamma')).toBeTruthy();
		});

		it('filters rows by select input', () => {
			const { container } = render(<DataTable data={filterData} columns={filterColumns} />);
			const selectEl = container.querySelector('select') as HTMLSelectElement;
			fireEvent.change(selectEl, { target: { value: 'inactive' } });
			const bodyRows = container.querySelectorAll('tbody tr');
			expect(bodyRows.length).toBe(1);
			expect(screen.getByText('Gadget Beta')).toBeTruthy();
		});

		it('shows noMatchMessage when filter yields no results', () => {
			render(
				<DataTable
					data={filterData}
					columns={filterColumns}
					noMatchMessage="No matches found"
				/>,
			);
			const textInput = screen.getByLabelText('Nameで絞り込み') as HTMLInputElement;
			fireEvent.change(textInput, { target: { value: 'ZZZZZZZ' } });
			expect(screen.getByText('No matches found')).toBeTruthy();
		});

		it('filter and sort work together', () => {
			const { container } = render(<DataTable data={filterData} columns={filterColumns} />);
			// Filter to active only
			const selectEl = container.querySelector('select') as HTMLSelectElement;
			fireEvent.change(selectEl, { target: { value: 'active' } });
			// Sort by name
			const nameHeader = screen.getByText('Name');
			fireEvent.click(nameHeader);
			const bodyRows = container.querySelectorAll('tbody tr');
			expect(bodyRows.length).toBe(2);
			// Sorted ascending: Widget Alpha, Widget Gamma
			const cells = container.querySelectorAll('tbody tr td');
			expect(cells[0].textContent).toBe('Widget Alpha');
		});

		it('shows default noMatchMessage when filter yields no results', () => {
			render(<DataTable data={filterData} columns={filterColumns} />);
			const textInput = screen.getByLabelText('Nameで絞り込み') as HTMLInputElement;
			fireEvent.change(textInput, { target: { value: 'ZZZZZZZ' } });
			expect(screen.getByText('No matching data')).toBeTruthy();
		});

		it('restores all rows when filter is cleared', () => {
			const { container } = render(<DataTable data={filterData} columns={filterColumns} />);
			const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
			fireEvent.change(textInput, { target: { value: 'Widget' } });
			expect(container.querySelectorAll('tbody tr').length).toBe(2);
			fireEvent.change(textInput, { target: { value: '' } });
			expect(container.querySelectorAll('tbody tr').length).toBe(3);
		});

		it('renders auto-derived options for select without explicit options', () => {
			const autoColumns = [
				{ key: 'name', label: 'Name' },
				{ key: 'status', label: 'Status', filter: { type: 'select' as const } },
			];
			const autoData = [
				{ name: 'A', status: 'running' },
				{ name: 'B', status: 'completed' },
				{ name: 'C', status: 'running' },
			];
			const { container } = render(<DataTable data={autoData} columns={autoColumns} />);
			const options = container.querySelectorAll('select option');
			// "すべて" + "completed" + "running" = 3
			expect(options.length).toBe(3);
			expect(options[1].textContent).toBe('completed');
			expect(options[2].textContent).toBe('running');
		});
	});

	describe('badge format', () => {
		it('renders Badge component with correct color from badgeMap', () => {
			const cols = [
				{ key: 'status', label: 'Status', format: 'badge', badgeMap: { active: 'green' as const, inactive: 'red' as const } },
			];
			const { container } = render(<DataTable data={[{ status: 'active' }]} columns={cols} />);
			const badge = container.querySelector('span.inline-flex');
			expect(badge).toBeTruthy();
			expect(badge!.textContent).toBe('active');
			expect(badge!.className).toContain('bg-success-soft');
		});

		it('falls back to gray when value not in badgeMap', () => {
			const cols = [
				{ key: 'status', label: 'Status', format: 'badge', badgeMap: { active: 'green' as const } },
			];
			const { container } = render(<DataTable data={[{ status: 'unknown' }]} columns={cols} />);
			const badge = container.querySelector('span.inline-flex');
			expect(badge).toBeTruthy();
			expect(badge!.className).toContain('bg-muted');
		});
	});

	describe('truncation', () => {
		it('adds max-w-xs to td when truncate is true', () => {
			const cols = [{ key: 'desc', label: 'Description', truncate: true }];
			const { container } = render(<DataTable data={[{ desc: 'Long text here' }]} columns={cols} />);
			const td = container.querySelector('td');
			expect(td!.className).toContain('max-w-xs');
		});

		it('adds truncate class to content span', () => {
			const cols = [{ key: 'desc', label: 'Description', truncate: true }];
			const { container } = render(<DataTable data={[{ desc: 'Long text here' }]} columns={cols} />);
			const span = container.querySelector('td span.truncate');
			expect(span).toBeTruthy();
		});

		it('sets title attribute for hover text', () => {
			const cols = [{ key: 'desc', label: 'Description', truncate: true }];
			const { container } = render(<DataTable data={[{ desc: 'Long text here' }]} columns={cols} />);
			const span = container.querySelector('td span[title]');
			expect(span!.getAttribute('title')).toBe('Long text here');
		});
	});

	describe('emptyValue', () => {
		it('shows emptyValue text when cell is null', () => {
			const cols = [{ key: 'assignee', label: 'Assignee', emptyValue: '未割当' }];
			render(<DataTable data={[{ assignee: null }]} columns={cols} />);
			expect(screen.getByText('未割当')).toBeTruthy();
		});

		it('shows emptyValue text when cell is empty string', () => {
			const cols = [{ key: 'assignee', label: 'Assignee', emptyValue: '未割当' }];
			render(<DataTable data={[{ assignee: '' }]} columns={cols} />);
			expect(screen.getByText('未割当')).toBeTruthy();
		});

		it('shows actual value when present', () => {
			const cols = [{ key: 'assignee', label: 'Assignee', emptyValue: '未割当' }];
			render(<DataTable data={[{ assignee: '田中' }]} columns={cols} />);
			expect(screen.getByText('田中')).toBeTruthy();
			expect(screen.queryByText('未割当')).toBeNull();
		});
	});

	describe('rowHighlight', () => {
		it('applies className to tr when rule matches', () => {
			const { container } = render(
				<DataTable
					data={[{ stock: 0 }]}
					columns={[{ key: 'stock', label: 'Stock' }]}
					rowHighlight={[{ key: 'stock', op: 'eq', value: 0, className: 'bg-red-50' }]}
				/>,
			);
			const tr = container.querySelector('tbody tr');
			expect(tr!.className).toContain('bg-red-50');
		});

		it('does not apply className when no rule matches', () => {
			const { container } = render(
				<DataTable
					data={[{ stock: 100 }]}
					columns={[{ key: 'stock', label: 'Stock' }]}
					rowHighlight={[{ key: 'stock', op: 'eq', value: 0, className: 'bg-red-50' }]}
				/>,
			);
			const tr = container.querySelector('tbody tr');
			expect(tr!.className).not.toContain('bg-red-50');
		});
	});

	describe('valueClassName', () => {
		it('wraps cell in span with matching className', () => {
			const cols = [
				{ key: 'code', label: 'Code', valueClassName: { '500': 'font-bold text-red-600' } },
			];
			const { container } = render(<DataTable data={[{ code: 500 }]} columns={cols} />);
			const span = container.querySelector('span.font-bold');
			expect(span).toBeTruthy();
			expect(span!.textContent).toBe('500');
		});
	});

	describe('pagination', () => {
		const paginationData = Array.from({ length: 5 }, (_, i) => ({
			name: `Item ${i + 1}`,
			amount: (i + 1) * 100,
		}));

		it('shows all rows when pageSize is not set (backward compat)', () => {
			const { container } = render(<DataTable data={paginationData} columns={columns} />);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows.length).toBe(5);
			// No pagination UI
			expect(screen.queryByText('前へ')).toBeNull();
		});

		it('shows only pageSize rows when set', () => {
			const { container } = render(
				<DataTable data={paginationData} columns={columns} pageSize={2} />,
			);
			const rows = container.querySelectorAll('tbody tr');
			expect(rows.length).toBe(2);
			expect(screen.getByText('Item 1')).toBeTruthy();
			expect(screen.getByText('Item 2')).toBeTruthy();
		});

		it('shows pagination UI with correct count', () => {
			render(<DataTable data={paginationData} columns={columns} pageSize={2} />);
			expect(screen.getByText(/5件中 1–2件/)).toBeTruthy();
			expect(screen.getByText('1 / 3')).toBeTruthy();
		});

		it('navigates to next page', () => {
			const { container } = render(
				<DataTable data={paginationData} columns={columns} pageSize={2} />,
			);
			fireEvent.click(screen.getByText('次へ'));
			const rows = container.querySelectorAll('tbody tr');
			expect(rows.length).toBe(2);
			expect(screen.getByText('Item 3')).toBeTruthy();
			expect(screen.getByText('Item 4')).toBeTruthy();
		});

		it('shows last page with remaining items', () => {
			render(<DataTable data={paginationData} columns={columns} pageSize={2} />);
			fireEvent.click(screen.getByText('次へ'));
			fireEvent.click(screen.getByText('次へ'));
			expect(screen.getByText('Item 5')).toBeTruthy();
			expect(screen.getByText(/5件中 5–5件/)).toBeTruthy();
		});

		it('resets to page 0 when filter changes', () => {
			const filterCols = [
				{ key: 'name', label: 'Name', filter: { type: 'text' as const } },
				{ key: 'amount', label: 'Amount', format: 'currency' },
			];
			const { container } = render(
				<DataTable data={paginationData} columns={filterCols} pageSize={2} />,
			);
			// Go to page 2
			fireEvent.click(screen.getByText('次へ'));
			expect(screen.getByText('2 / 3')).toBeTruthy();
			// Apply filter — should reset to page 1
			const textInput = container.querySelector('input[type="text"]') as HTMLInputElement;
			fireEvent.change(textInput, { target: { value: 'Item' } });
			expect(screen.getByText(/1 \//)).toBeTruthy();
		});

		it('resets to page 0 when sort changes', () => {
			const sortCols = [
				{ key: 'name', label: 'Name', sortable: true },
				{ key: 'amount', label: 'Amount' },
			];
			render(<DataTable data={paginationData} columns={sortCols} pageSize={2} />);
			fireEvent.click(screen.getByText('次へ'));
			expect(screen.getByText('2 / 3')).toBeTruthy();
			// Sort — should reset to page 1
			fireEvent.click(screen.getByText('Name'));
			expect(screen.getByText(/1 \//)).toBeTruthy();
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

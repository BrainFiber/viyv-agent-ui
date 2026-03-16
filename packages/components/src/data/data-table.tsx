import { useCallback, useMemo, useState } from 'react';
import { cn } from '../lib/cn.js';

export interface DataTableColumn {
	key: string;
	label: string;
	sortable?: boolean;
	format?: string;
}

export interface DataTableProps {
	data: unknown;
	columns: DataTableColumn[];
	rowHref?: string;
	onRowClick?: (row: Record<string, unknown>) => void;
	keyField?: string;
	emptyMessage?: string;
	className?: string;
}

function interpolateTemplate(template: string, row: Record<string, unknown>): string {
	return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
		const val = row[key];
		return val != null ? encodeURIComponent(String(val)) : '';
	});
}

function formatCell(value: unknown, format?: string): string {
	if (value == null || value === '') return '';
	const num = Number(value);
	if (!Number.isNaN(num)) {
		switch (format) {
			case 'currency':
				return new Intl.NumberFormat('ja-JP', {
					style: 'currency',
					currency: 'JPY',
				}).format(num);
			case 'number':
				return new Intl.NumberFormat('ja-JP').format(num);
			case 'percent':
				return new Intl.NumberFormat('ja-JP', {
					style: 'percent',
					minimumFractionDigits: 0,
					maximumFractionDigits: 1,
				}).format(num);
			default:
				break;
		}
	}
	if (format === 'date' && (typeof value === 'string' || typeof value === 'number')) {
		const d = new Date(value);
		if (!Number.isNaN(d.getTime())) {
			return d.toLocaleDateString('ja-JP');
		}
	}
	return String(value);
}

function getAriaSortValue(
	col: DataTableColumn,
	sortKey: string | null,
	sortOrder: 'asc' | 'desc',
): 'ascending' | 'descending' | 'none' | undefined {
	if (!col.sortable) return undefined;
	if (sortKey !== col.key) return 'none';
	return sortOrder === 'asc' ? 'ascending' : 'descending';
}

export function DataTable({
	data,
	columns,
	rowHref,
	onRowClick,
	keyField,
	emptyMessage = 'No data',
	className,
}: DataTableProps) {
	const [sort, setSort] = useState<{ key: string | null; order: 'asc' | 'desc' }>({
		key: null,
		order: 'asc',
	});
	const sortKey = sort.key;
	const sortOrder = sort.order;

	const rows = useMemo(() => {
		if (!Array.isArray(data)) return [];
		const result = [...data] as Record<string, unknown>[];

		if (sortKey) {
			result.sort((a, b) => {
				const aVal = a[sortKey];
				const bVal = b[sortKey];
				if (aVal == null && bVal == null) return 0;
				if (aVal == null) return 1;
				if (bVal == null) return -1;
				if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
				if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
				return 0;
			});
		}

		return result;
	}, [data, sortKey, sortOrder]);

	const handleSort = useCallback((key: string) => {
		setSort((prev) =>
			prev.key === key
				? { key, order: prev.order === 'asc' ? 'desc' : 'asc' }
				: { key, order: 'asc' },
		);
	}, []);

	const isClickable = !!(rowHref || onRowClick);

	return (
		<section className={cn('overflow-auto rounded-lg border', className)} aria-label="Data table">
			<table className="w-full text-sm">
				<thead className="border-b bg-gray-50">
					<tr>
						{columns.map((col) => (
							<th
								key={col.key}
								scope="col"
								className={cn(
									'px-4 py-3 text-left font-medium text-gray-700',
									col.sortable && 'cursor-pointer select-none hover:bg-gray-100',
								)}
								onClick={col.sortable ? () => handleSort(col.key) : undefined}
								onKeyDown={
									col.sortable
										? (e) => {
												if (e.key === 'Enter' || e.key === ' ') {
													e.preventDefault();
													handleSort(col.key);
												}
											}
										: undefined
								}
								tabIndex={col.sortable ? 0 : undefined}
								role={col.sortable ? 'columnheader' : undefined}
								aria-sort={getAriaSortValue(col, sortKey, sortOrder)}
							>
								{col.label}
								{col.sortable && sortKey === col.key && (
									<span className="ml-1" aria-hidden="true">
										{sortOrder === 'asc' ? '\u2191' : '\u2193'}
									</span>
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, index) => {
						const rowKey = keyField
							? String(row[keyField] ?? index)
							: columns.map((c) => String(row[c.key] ?? '')).join('|') || String(index);

						const href = rowHref ? interpolateTemplate(rowHref, row) : undefined;

						return (
							<tr
								key={rowKey}
								className={cn(
									'border-b last:border-b-0 hover:bg-gray-50',
									isClickable && 'cursor-pointer',
								)}
								onClick={
									onRowClick ? () => onRowClick(row) : undefined
								}
							>
								{columns.map((col) => (
									<td key={col.key} className={href ? '' : 'px-4 py-3'}>
										{href ? (
											<a
												href={href}
												className="block px-4 py-3 no-underline text-inherit"
											>
												{formatCell(row[col.key], col.format)}
											</a>
										) : (
											formatCell(row[col.key], col.format)
										)}
									</td>
								))}
							</tr>
						);
					})}
					{rows.length === 0 && (
						<tr>
							<td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
								{emptyMessage}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</section>
	);
}

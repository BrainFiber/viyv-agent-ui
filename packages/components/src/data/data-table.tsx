import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '../display/badge.js';
import { cn } from '../lib/cn.js';
import { ArrowUp, ArrowDown } from '../lib/icons.js';
import { normalizeData } from '../lib/normalize-data.js';
import { usePagination } from '../lib/use-pagination.js';
import { Pagination } from '../navigation/pagination.js';
import { applyFilters, deriveSelectOptions, evaluateRowHighlight, type DataTableFilterConfig, type RowHighlightRule } from './data-table-filter.js';

export type { DataTableFilterConfig, RowHighlightRule } from './data-table-filter.js';

export interface DataTableColumn {
	key: string;
	label: string;
	sortable?: boolean;
	format?: string;
	filter?: DataTableFilterConfig;
	minWidth?: number;
	badgeMap?: Record<string, 'gray' | 'blue' | 'green' | 'yellow' | 'red'>;
	truncate?: boolean;
	emptyValue?: string;
	valueClassName?: Record<string, string>;
}

export interface DataTableProps {
	data: unknown;
	columns: DataTableColumn[];
	rowHref?: string;
	onRowClick?: (row: Record<string, unknown>) => void;
	keyField?: string;
	emptyMessage?: string;
	noMatchMessage?: string;
	className?: string;
	rowHighlight?: RowHighlightRule[];
	pageSize?: number;
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

function renderCellContent(col: DataTableColumn, value: unknown): React.ReactNode {
	// 1. 空値フォールバック
	if (value == null || value === '') {
		if (col.emptyValue) return <span className="text-fg-subtle">{col.emptyValue}</span>;
		return formatCell(value, col.format);
	}
	// 2. Badge フォーマット
	if (col.format === 'badge') {
		const strVal = String(value);
		const color = col.badgeMap?.[strVal] ?? 'gray';
		return <Badge text={strVal} color={color} />;
	}
	// 3. 通常フォーマット
	const formatted = formatCell(value, col.format);
	// 4. 値ベースクラス
	if (col.valueClassName) {
		const cls = col.valueClassName[String(value)];
		if (cls) return <span className={cls}>{formatted}</span>;
	}
	return formatted;
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
	noMatchMessage = 'No matching data',
	className,
	rowHighlight,
	pageSize,
}: DataTableProps) {
	const [sort, setSort] = useState<{ key: string | null; order: 'asc' | 'desc' }>({
		key: null,
		order: 'asc',
	});
	const sortKey = sort.key;
	const sortOrder = sort.order;

	const [filters, setFilters] = useState<Record<string, string>>({});

	const handleFilterChange = useCallback((columnKey: string, value: string) => {
		setFilters((prev) => {
			const next = { ...prev };
			if (value === '') {
				delete next[columnKey];
			} else {
				next[columnKey] = value;
			}
			return next;
		});
	}, []);

	const selectOptions = useMemo(
		() => deriveSelectOptions(normalizeData(data, 'DataTable'), columns),
		[data, columns],
	);

	const rows = useMemo(() => {
		const normalized = normalizeData(data, 'DataTable');
		if (normalized.length === 0) return [];
		const filtered = applyFilters([...normalized], columns, filters);

		if (sortKey) {
			filtered.sort((a, b) => {
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

		return filtered;
	}, [data, columns, filters, sortKey, sortOrder]);

	const {
		pagedData,
		currentPage,
		totalPages,
		totalItems,
		pageSize: effectivePageSize,
		setCurrentPage,
		resetPage,
	} = usePagination({ data: rows, pageSize });

	// Reset to first page when filters or sort change
	useEffect(() => {
		resetPage();
	}, [filters, sort, resetPage]);

	const handleSort = useCallback((key: string) => {
		setSort((prev) =>
			prev.key === key
				? { key, order: prev.order === 'asc' ? 'desc' : 'asc' }
				: { key, order: 'asc' },
		);
	}, []);

	const isClickable = !!(rowHref || onRowClick);
	const hasFilters = columns.some((col) => col.filter);
	const isFiltered = Object.keys(filters).length > 0;

	return (
		<section className={cn('overflow-auto rounded-xl border shadow-sm', className)} aria-label="Data table">
			<table className="w-full text-sm" style={{ tableLayout: 'auto', wordBreak: 'break-word' }}>
				<thead className="border-b bg-muted/50">
					<tr>
						{columns.map((col) => (
							<th
								key={col.key}
								scope="col"
								className={cn(
									'px-4 py-3 text-left font-medium text-fg-secondary',
									col.sortable && 'cursor-pointer select-none hover:bg-muted',
								)}
								style={col.minWidth ? { minWidth: col.minWidth } : undefined}
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
									<span className="ml-1 inline-flex" aria-hidden="true">
										{sortOrder === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
									</span>
								)}
							</th>
						))}
					</tr>
					{hasFilters && (
						<tr className="border-b bg-surface">
							{columns.map((col) => (
								<th key={`filter-${col.key}`} className="px-4 py-2 font-normal">
									{col.filter?.type === 'text' && (
										<input
											type="text"
											value={filters[col.key] ?? ''}
											placeholder={col.filter.placeholder ?? '検索...'}
											onChange={(e) => handleFilterChange(col.key, e.target.value)}
											className="w-full rounded-md border border-border-strong bg-surface px-2 py-1 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring/30"
											aria-label={`${col.label}で絞り込み`}
										/>
									)}
									{col.filter?.type === 'select' && (
										<select
											value={filters[col.key] ?? ''}
											onChange={(e) => handleFilterChange(col.key, e.target.value)}
											className="w-full rounded-md border border-border-strong bg-surface px-2 py-1 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring/30"
											aria-label={`${col.label}で絞り込み`}
										>
											<option value="">{col.filter.placeholder ?? 'すべて'}</option>
											{(col.filter.options ?? selectOptions[col.key] ?? []).map((opt) => (
												<option key={opt.value} value={opt.value}>
													{opt.label}
												</option>
											))}
										</select>
									)}
								</th>
							))}
						</tr>
					)}
				</thead>
				<tbody>
					{pagedData.map((row, index) => {
						const rowKey = keyField
							? String(row[keyField] ?? index)
							: `${index}:${columns.map((c) => String(row[c.key] ?? '')).join('|')}`;

						const href = rowHref ? interpolateTemplate(rowHref, row) : undefined;

						return (
							<tr
								key={rowKey}
								className={cn(
									'border-b last:border-b-0 hover:bg-muted/50',
									isClickable && 'cursor-pointer',
									evaluateRowHighlight(row, rowHighlight),
								)}
								onClick={
									onRowClick ? () => onRowClick(row) : undefined
								}
							>
								{columns.map((col) => {
									const content = renderCellContent(col, row[col.key]);
									const isTruncated = col.truncate && col.format !== 'badge';
									const titleText = isTruncated ? String(row[col.key] ?? '') : undefined;

									return (
										<td key={col.key} className={cn(href ? '' : 'px-4 py-3', isTruncated && 'max-w-xs')} style={col.minWidth ? { minWidth: col.minWidth } : undefined}>
											{href ? (
												<a
													href={href}
													className={cn('block px-4 py-3 no-underline text-inherit', isTruncated && 'truncate')}
													title={titleText}
												>
													{content}
												</a>
											) : isTruncated ? (
												<span className="block truncate" title={titleText}>{content}</span>
											) : (
												content
											)}
										</td>
									);
								})}
							</tr>
						);
					})}
					{rows.length === 0 && (
						<tr>
							<td colSpan={columns.length} className="px-4 py-8 text-center text-fg-subtle">
								{isFiltered ? noMatchMessage : emptyMessage}
							</td>
						</tr>
					)}
				</tbody>
			</table>
			{pageSize && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					totalItems={totalItems}
					pageSize={effectivePageSize}
					onPageChange={setCurrentPage}
				/>
			)}
		</section>
	);
}

export const dataTableMeta: ComponentMeta = {
	type: 'DataTable',
	label: 'Data Table',
	description: 'Sortable, filterable data table with row linking and click handling',
	category: 'data',
	propsSchema: z.object({
		data: z.unknown(),
		columns: z.array(
			z.object({
				key: z.string(),
				label: z.string(),
				sortable: z.boolean().optional(),
				format: z.enum(['currency', 'number', 'percent', 'date', 'badge']).optional(),
				filter: z.object({
					type: z.enum(['text', 'select']),
					placeholder: z.string().optional(),
					options: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
				}).optional(),
				minWidth: z.number().optional(),
				badgeMap: z.record(z.enum(['gray', 'blue', 'green', 'yellow', 'red'])).optional(),
				truncate: z.boolean().optional(),
				emptyValue: z.string().optional(),
				valueClassName: z.record(z.string()).optional(),
			}),
		),
		rowHref: z.string().optional(),
		onRowClick: z.unknown().optional(),
		keyField: z.string().optional(),
		emptyMessage: z.string().optional(),
		noMatchMessage: z.string().optional(),
		rowHighlight: z.array(z.object({
			key: z.string(),
			op: z.enum(['eq', 'neq', 'lt', 'gt', 'lte', 'gte']),
			value: z.unknown().optional(),
			field: z.string().optional(),
			className: z.string(),
		})).optional(),
		pageSize: z.number().int().positive().optional(),
	}),
	acceptsChildren: false,
};

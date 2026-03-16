import { describe, expect, it } from 'vitest';
import { applyFilters, deriveSelectOptions, evaluateRowHighlight, type RowHighlightRule } from '../data/data-table-filter.js';

describe('applyFilters', () => {
	const columns = [
		{ key: 'name', filter: { type: 'text' as const } },
		{ key: 'status', filter: { type: 'select' as const } },
	];

	const rows = [
		{ name: 'Widget Alpha', status: 'active' },
		{ name: 'Gadget Beta', status: 'inactive' },
		{ name: 'Widget Gamma', status: 'active' },
	];

	it('returns rows matching text filter by partial match', () => {
		const result = applyFilters(rows, columns, { name: 'Widget' });
		expect(result).toHaveLength(2);
		expect(result[0].name).toBe('Widget Alpha');
		expect(result[1].name).toBe('Widget Gamma');
	});

	it('text filter is case-insensitive', () => {
		const result = applyFilters(rows, columns, { name: 'widget' });
		expect(result).toHaveLength(2);
	});

	it('returns rows matching select filter by exact match', () => {
		const result = applyFilters(rows, columns, { status: 'inactive' });
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Gadget Beta');
	});

	it('does not crash on null/undefined cell values', () => {
		const rowsWithNull = [
			{ name: null, status: 'active' },
			{ name: undefined, status: 'active' },
			{ name: 'Widget', status: 'active' },
		];
		const result = applyFilters(rowsWithNull as Record<string, unknown>[], columns, { name: 'Widget' });
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Widget');
	});

	it('skips columns with empty filter value', () => {
		const result = applyFilters(rows, columns, { name: '' });
		expect(result).toHaveLength(3);
	});

	it('applies multiple filters with AND logic', () => {
		const result = applyFilters(rows, columns, { name: 'Widget', status: 'active' });
		expect(result).toHaveLength(2);
		// Both Widget Alpha and Widget Gamma are active
	});

	it('AND logic filters down correctly', () => {
		const result = applyFilters(rows, columns, { name: 'Alpha', status: 'active' });
		expect(result).toHaveLength(1);
		expect(result[0].name).toBe('Widget Alpha');
	});

	it('returns all rows when no filters active', () => {
		const result = applyFilters(rows, columns, {});
		expect(result).toHaveLength(3);
	});

	it('ignores filter keys that have no corresponding column filter config', () => {
		const colsNoFilter = [{ key: 'name' }, { key: 'status' }];
		const result = applyFilters(rows, colsNoFilter, { name: 'Widget' });
		expect(result).toHaveLength(3);
	});
});

describe('deriveSelectOptions', () => {
	const data = [
		{ status: 'active', region: '東京' },
		{ status: 'inactive', region: '大阪' },
		{ status: 'active', region: '東京' },
		{ status: 'pending', region: null },
		{ status: '', region: '福岡' },
	];

	it('returns sorted unique values for select columns without options', () => {
		const columns = [{ key: 'status', filter: { type: 'select' as const } }];
		const result = deriveSelectOptions(data as Record<string, unknown>[], columns);
		expect(result.status).toEqual([
			{ value: 'active', label: 'active' },
			{ value: 'inactive', label: 'inactive' },
			{ value: 'pending', label: 'pending' },
		]);
	});

	it('skips columns that already have options defined', () => {
		const columns = [
			{
				key: 'status',
				filter: {
					type: 'select' as const,
					options: [{ value: 'active', label: 'Active' }],
				},
			},
		];
		const result = deriveSelectOptions(data as Record<string, unknown>[], columns);
		expect(result.status).toBeUndefined();
	});

	it('excludes null and empty string values', () => {
		const columns = [
			{ key: 'status', filter: { type: 'select' as const } },
			{ key: 'region', filter: { type: 'select' as const } },
		];
		const result = deriveSelectOptions(data as Record<string, unknown>[], columns);
		// status: '' is excluded
		expect(result.status).toHaveLength(3);
		// region: null is excluded
		expect(result.region).toEqual([
			{ value: '大阪', label: '大阪' },
			{ value: '東京', label: '東京' },
			{ value: '福岡', label: '福岡' },
		]);
	});

	it('skips non-select columns', () => {
		const columns = [{ key: 'status', filter: { type: 'text' as const } }];
		const result = deriveSelectOptions(data as Record<string, unknown>[], columns);
		expect(result.status).toBeUndefined();
	});

	it('returns empty object for empty data array', () => {
		const columns = [{ key: 'status', filter: { type: 'select' as const } }];
		const result = deriveSelectOptions([], columns);
		expect(result.status).toEqual([]);
	});
});

describe('evaluateRowHighlight', () => {
	it('returns empty string for undefined rules', () => {
		expect(evaluateRowHighlight({ a: 1 }, undefined)).toBe('');
	});

	it('returns empty string for empty rules array', () => {
		expect(evaluateRowHighlight({ a: 1 }, [])).toBe('');
	});

	it('matches eq with string value', () => {
		const rules: RowHighlightRule[] = [{ key: 'status', op: 'eq', value: 'error', className: 'bg-red' }];
		expect(evaluateRowHighlight({ status: 'error' }, rules)).toBe('bg-red');
	});

	it('matches lt with numeric value', () => {
		const rules: RowHighlightRule[] = [{ key: 'stock', op: 'lt', value: 10, className: 'bg-yellow' }];
		expect(evaluateRowHighlight({ stock: 5 }, rules)).toBe('bg-yellow');
	});

	it('matches field comparison (stock < minStock)', () => {
		const rules: RowHighlightRule[] = [{ key: 'stock', op: 'lt', field: 'minStock', className: 'bg-yellow-50' }];
		expect(evaluateRowHighlight({ stock: 8, minStock: 30 }, rules)).toBe('bg-yellow-50');
	});

	it('returns empty string when no rule matches', () => {
		const rules: RowHighlightRule[] = [{ key: 'stock', op: 'lt', value: 5, className: 'bg-red' }];
		expect(evaluateRowHighlight({ stock: 100 }, rules)).toBe('');
	});

	it('returns first matching rule className (order matters)', () => {
		const rules: RowHighlightRule[] = [
			{ key: 'stock', op: 'eq', value: 0, className: 'bg-red' },
			{ key: 'stock', op: 'lt', value: 10, className: 'bg-yellow' },
		];
		expect(evaluateRowHighlight({ stock: 0 }, rules)).toBe('bg-red');
	});

	it('returns false for relational op when cell value is null', () => {
		const rules: RowHighlightRule[] = [{ key: 'stock', op: 'lt', value: 10, className: 'bg-red' }];
		expect(evaluateRowHighlight({ stock: null }, rules)).toBe('');
	});

	it('matches neq', () => {
		const rules: RowHighlightRule[] = [{ key: 'status', op: 'neq', value: 'ok', className: 'bg-yellow' }];
		expect(evaluateRowHighlight({ status: 'error' }, rules)).toBe('bg-yellow');
	});

	it('compares numeric strings correctly (statusCode)', () => {
		const rules: RowHighlightRule[] = [{ key: 'statusCode', op: 'gte', value: 500, className: 'bg-red' }];
		expect(evaluateRowHighlight({ statusCode: 500 }, rules)).toBe('bg-red');
		expect(evaluateRowHighlight({ statusCode: 200 }, rules)).toBe('');
	});
});

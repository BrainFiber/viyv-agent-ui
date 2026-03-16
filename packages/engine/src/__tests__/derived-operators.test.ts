import { describe, expect, it } from 'vitest';
import { applyDerivedOperations } from '../derived-operators.js';

const data = [
	{ product: 'Widget', region: 'east', amount: 100 },
	{ product: 'Gadget', region: 'west', amount: 200 },
	{ product: 'Widget', region: 'west', amount: 150 },
	{ product: 'Gadget', region: 'east', amount: 50 },
];

describe('applyDerivedOperations', () => {
	it('returns non-arrays unchanged', () => {
		expect(applyDerivedOperations('hello', {})).toBe('hello');
		expect(applyDerivedOperations(42, {})).toBe(42);
	});

	it('sorts ascending', () => {
		const result = applyDerivedOperations(data, {
			sort: { key: 'amount', order: 'asc' },
		});
		expect((result as Record<string, unknown>[])[0].amount).toBe(50);
		expect((result as Record<string, unknown>[])[3].amount).toBe(200);
	});

	it('sorts descending', () => {
		const result = applyDerivedOperations(data, {
			sort: { key: 'amount', order: 'desc' },
		});
		expect((result as Record<string, unknown>[])[0].amount).toBe(200);
	});

	it('filters by string match (case-insensitive)', () => {
		const result = applyDerivedOperations(data, {
			filter: { key: 'product', match: 'widget' },
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(2);
		expect(result.every((r) => r.product === 'Widget')).toBe(true);
	});

	it('limits results', () => {
		const result = applyDerivedOperations(data, { limit: 2 }) as unknown[];
		expect(result).toHaveLength(2);
	});

	it('groups by column', () => {
		const result = applyDerivedOperations(data, {
			groupBy: 'product',
			aggregate: { fn: 'sum', key: 'amount' },
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(2);
		const widget = result.find((r) => r.product === 'Widget');
		expect(widget?.amount).toBe(250);
	});

	it('aggregates without groupBy', () => {
		const result = applyDerivedOperations(data, {
			aggregate: { fn: 'avg', key: 'amount' },
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(1);
		expect(result[0].amount).toBe(125);
	});

	it('combines filter + sort + limit', () => {
		const result = applyDerivedOperations(data, {
			filter: { key: 'region', match: 'west' },
			sort: { key: 'amount', order: 'desc' },
			limit: 1,
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(1);
		expect(result[0].amount).toBe(200);
	});

	it('handles empty array input', () => {
		const result = applyDerivedOperations([], {
			sort: { key: 'amount', order: 'asc' },
		}) as unknown[];
		expect(result).toHaveLength(0);
	});

	it('returns null for aggregate on empty array (sum)', () => {
		const result = applyDerivedOperations([], {
			aggregate: { fn: 'sum', key: 'amount' },
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(1);
		expect(result[0].amount).toBeNull();
	});

	it('returns null for aggregate on empty array (avg)', () => {
		const result = applyDerivedOperations([], {
			aggregate: { fn: 'avg', key: 'amount' },
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(1);
		expect(result[0].amount).toBeNull();
	});

	it('count aggregate returns 0 for empty array', () => {
		const result = applyDerivedOperations([], {
			aggregate: { fn: 'count', key: 'amount' },
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(1);
		expect(result[0].amount).toBe(0);
	});

	it('handles non-numeric values in aggregation', () => {
		const mixedData = [
			{ name: 'Alice', score: 'abc' },
			{ name: 'Bob', score: 100 },
		];
		const result = applyDerivedOperations(mixedData, {
			aggregate: { fn: 'sum', key: 'score' },
		}) as Record<string, unknown>[];
		expect(result[0].score).toBe(100);
	});

	// useSqlQuery returns { columns, rows, rowCount } wrapper
	it('unwraps { rows } from useSqlQuery results', () => {
		const wrapped = {
			columns: ['product', 'amount'],
			rows: [
				{ product: 'Widget', amount: 100 },
				{ product: 'Gadget', amount: 200 },
			],
			rowCount: 2,
		};
		const result = applyDerivedOperations(wrapped, {
			sort: { key: 'amount', order: 'desc' },
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(2);
		expect(result[0].amount).toBe(200);
		expect(result[1].amount).toBe(100);
	});

	it('aggregates on { rows } wrapper', () => {
		const wrapped = {
			columns: ['amount'],
			rows: [{ amount: 100 }, { amount: 200 }, { amount: 300 }],
			rowCount: 3,
		};
		const result = applyDerivedOperations(wrapped, {
			aggregate: { fn: 'sum', key: 'amount' },
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(1);
		expect(result[0].amount).toBe(600);
	});

	it('returns non-array non-wrapper objects unchanged', () => {
		const obj = { foo: 'bar' };
		expect(applyDerivedOperations(obj, {})).toBe(obj);
	});

	it('renames aggregate key when groupBy and aggregate key collide', () => {
		const statusData = [
			{ status: 'active', name: 'Alice' },
			{ status: 'active', name: 'Bob' },
			{ status: 'inactive', name: 'Charlie' },
		];
		const result = applyDerivedOperations(statusData, {
			groupBy: 'status',
			aggregate: { fn: 'count', key: 'status' },
		}) as Record<string, unknown>[];
		expect(result).toHaveLength(2);
		const active = result.find((r) => r.status === 'active');
		expect(active?.status_count).toBe(2);
		expect(active).not.toHaveProperty('status', 2); // groupBy value preserved, not overwritten
		const inactive = result.find((r) => r.status === 'inactive');
		expect(inactive?.status_count).toBe(1);
	});

	it('does not rename aggregate key when no collision', () => {
		const result = applyDerivedOperations(data, {
			groupBy: 'product',
			aggregate: { fn: 'sum', key: 'amount' },
		}) as Record<string, unknown>[];
		const widget = result.find((r) => r.product === 'Widget');
		expect(widget?.amount).toBe(250);
		expect(widget).not.toHaveProperty('amount_sum');
	});

	it('sorts with null values', () => {
		const dataWithNulls = [
			{ name: 'A', value: 3 },
			{ name: 'B', value: null },
			{ name: 'C', value: 1 },
		];
		const result = applyDerivedOperations(dataWithNulls, {
			sort: { key: 'value', order: 'asc' },
		}) as Record<string, unknown>[];
		expect(result[0].name).toBe('C');
		expect(result[2].name).toBe('B');
	});
});

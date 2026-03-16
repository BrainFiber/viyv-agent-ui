import { describe, expect, it } from 'vitest';
import { normalizeChartData, toNumber } from '../chart/chart-utils.js';

describe('normalizeChartData', () => {
	it('returns array data as-is', () => {
		const data = [{ a: 1 }, { a: 2 }];
		expect(normalizeChartData(data)).toBe(data);
	});

	it('unwraps { rows } wrapper', () => {
		const rows = [{ x: 'A' }, { x: 'B' }];
		expect(normalizeChartData({ rows })).toBe(rows);
	});

	it('returns [] for undefined', () => {
		expect(normalizeChartData(undefined)).toEqual([]);
	});

	it('returns [] for null', () => {
		expect(normalizeChartData(null)).toEqual([]);
	});

	it('returns [] for object without rows', () => {
		expect(normalizeChartData({ foo: 'bar' })).toEqual([]);
	});

	it('returns [] for { rows } where rows is not an array', () => {
		expect(normalizeChartData({ rows: 'not-array' })).toEqual([]);
	});

	it('returns [] for primitive values', () => {
		expect(normalizeChartData(42)).toEqual([]);
		expect(normalizeChartData('string')).toEqual([]);
		expect(normalizeChartData(true)).toEqual([]);
	});
});

describe('toNumber', () => {
	it('converts numeric values', () => {
		expect(toNumber(42)).toBe(42);
		expect(toNumber(3.14)).toBe(3.14);
	});

	it('converts stringified numbers (SQL result pattern)', () => {
		expect(toNumber('42')).toBe(42);
		expect(toNumber('3.14')).toBe(3.14);
		expect(toNumber('0')).toBe(0);
	});

	it('returns 0 for non-numeric strings', () => {
		expect(toNumber('abc')).toBe(0);
		expect(toNumber('')).toBe(0);
	});

	it('returns 0 for null/undefined', () => {
		expect(toNumber(null)).toBe(0);
		expect(toNumber(undefined)).toBe(0);
	});

	it('returns 0 for NaN', () => {
		expect(toNumber(NaN)).toBe(0);
	});
});

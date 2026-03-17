import { describe, expect, it } from 'vitest';
import { parseDateRange, dateToPercent, generateDateTicks } from '../chart/gantt-utils.js';

describe('parseDateRange', () => {
	it('returns correct min/max', () => {
		const data = [
			{ start: '2026-03-01', end: '2026-03-10' },
			{ start: '2026-03-05', end: '2026-03-20' },
		];
		const { rangeStart, rangeEnd } = parseDateRange(data, 'start', 'end');
		// rangeStart should be 1 day before 2026-03-01
		expect(rangeStart.getTime()).toBeLessThan(new Date('2026-03-01').getTime());
		// rangeEnd should be 1 day after 2026-03-20
		expect(rangeEnd.getTime()).toBeGreaterThan(new Date('2026-03-20').getTime());
	});

	it('handles empty data', () => {
		const { rangeStart, rangeEnd } = parseDateRange([], 'start', 'end');
		expect(rangeStart).toBeInstanceOf(Date);
		expect(rangeEnd).toBeInstanceOf(Date);
		expect(rangeEnd.getTime()).toBeGreaterThan(rangeStart.getTime());
	});
});

describe('dateToPercent', () => {
	it('calculates correct position', () => {
		const start = new Date('2026-03-01');
		const end = new Date('2026-03-11'); // 10 days
		const mid = new Date('2026-03-06'); // 5 days in

		expect(dateToPercent(start, start, end)).toBe(0);
		expect(dateToPercent(end, start, end)).toBe(100);
		expect(dateToPercent(mid, start, end)).toBe(50);
	});

	it('returns 0 for zero-length range', () => {
		const d = new Date('2026-03-01');
		expect(dateToPercent(d, d, d)).toBe(0);
	});
});

describe('generateDateTicks', () => {
	it('creates appropriate ticks for short range', () => {
		const start = new Date('2026-03-01');
		const end = new Date('2026-03-07');
		const ticks = generateDateTicks(start, end);
		expect(ticks.length).toBeGreaterThan(0);
		for (const tick of ticks) {
			expect(tick.percent).toBeGreaterThanOrEqual(0);
			expect(tick.percent).toBeLessThanOrEqual(100);
			expect(tick.label).toBeTruthy();
		}
	});

	it('creates weekly ticks for medium range', () => {
		const start = new Date('2026-03-01');
		const end = new Date('2026-04-15');
		const ticks = generateDateTicks(start, end);
		expect(ticks.length).toBeGreaterThan(0);
		expect(ticks.length).toBeLessThanOrEqual(10);
	});

	it('creates monthly ticks for long range', () => {
		const start = new Date('2026-01-01');
		const end = new Date('2026-12-31');
		const ticks = generateDateTicks(start, end);
		expect(ticks.length).toBeGreaterThan(0);
		// Should have roughly 11-12 monthly ticks
		expect(ticks.length).toBeGreaterThanOrEqual(10);
	});
});

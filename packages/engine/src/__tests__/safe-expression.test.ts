import { describe, expect, it } from 'vitest';
import type { EvalContext } from '../expression-evaluator.js';
import { evaluateSafeExpression } from '../safe-expression.js';

const ctx: EvalContext = {
	hooks: { sales: [1, 2, 3], stats: { total: 100 } },
	state: { page: 1 },
	actions: {},
};

describe('evaluateSafeExpression', () => {
	it('evaluates comparisons', () => {
		expect(evaluateSafeExpression('hook.stats.total > 50', ctx)).toBe(true);
		expect(evaluateSafeExpression('hook.stats.total < 50', ctx)).toBe(false);
	});

	it('evaluates logical operators', () => {
		expect(evaluateSafeExpression('hook.stats.total > 50 && state.page === 1', ctx)).toBe(true);
	});

	it('evaluates arithmetic', () => {
		expect(evaluateSafeExpression('hook.stats.total * 2', ctx)).toBe(200);
	});

	it('evaluates ternary', () => {
		expect(evaluateSafeExpression('hook.stats.total > 50 ? "high" : "low"', ctx)).toBe('high');
	});

	it('rejects function keyword', () => {
		expect(() => evaluateSafeExpression('function() {}', ctx)).toThrow('Unsafe expression');
	});

	it('rejects eval', () => {
		expect(() => evaluateSafeExpression('eval("1+1")', ctx)).toThrow('Unsafe expression');
	});

	it('rejects assignments', () => {
		expect(() => evaluateSafeExpression('hook.stats.total = 0', ctx)).toThrow('Unsafe expression');
	});

	it('returns undefined for runtime errors', () => {
		expect(evaluateSafeExpression('nonexistent.property', ctx)).toBeUndefined();
	});

	it('rejects Function constructor', () => {
		expect(() => evaluateSafeExpression('Function("return 1")()', ctx)).toThrow(
			'Unsafe expression',
		);
	});

	it('rejects globalThis', () => {
		expect(() => evaluateSafeExpression('globalThis', ctx)).toThrow('Unsafe expression');
	});

	it('rejects this keyword', () => {
		expect(() => evaluateSafeExpression('this', ctx)).toThrow('Unsafe expression');
	});

	it('allows !== comparisons', () => {
		expect(evaluateSafeExpression('hook.stats.total !== 0', ctx)).toBe(true);
	});

	it('allows >= and <= comparisons', () => {
		expect(evaluateSafeExpression('hook.stats.total >= 100', ctx)).toBe(true);
		expect(evaluateSafeExpression('hook.stats.total <= 100', ctx)).toBe(true);
	});

	it('allows negative numbers in subtraction', () => {
		expect(evaluateSafeExpression('hook.stats.total - 50', ctx)).toBe(50);
	});
});

import { describe, expect, it } from 'vitest';
import { evaluateVisibility, resolveProps, resolveValue } from '../expression-evaluator.js';
import type { EvalContext } from '../expression-evaluator.js';

const ctx: EvalContext = {
	hooks: {
		sales: [
			{ product: 'Widget', amount: 100 },
			{ product: 'Gadget', amount: 200 },
		],
		stats: { total: 300, count: 2 },
	},
	state: { filter: 'Widget', page: 1 },
	actions: {
		refresh: () => {},
	},
};

describe('resolveValue', () => {
	it('returns non-expressions as-is', () => {
		expect(resolveValue('hello', ctx)).toBe('hello');
		expect(resolveValue(42, ctx)).toBe(42);
		expect(resolveValue(null, ctx)).toBeNull();
	});

	it('resolves $hook.xxx', () => {
		expect(resolveValue('$hook.sales', ctx)).toEqual(ctx.hooks.sales);
	});

	it('resolves $hook.xxx.nested', () => {
		expect(resolveValue('$hook.stats.total', ctx)).toBe(300);
	});

	it('resolves $state.xxx', () => {
		expect(resolveValue('$state.filter', ctx)).toBe('Widget');
	});

	it('resolves $bindState.xxx', () => {
		expect(resolveValue('$bindState.filter', ctx)).toBe('Widget');
	});

	it('resolves $action.xxx', () => {
		expect(resolveValue('$action.refresh', ctx)).toBe(ctx.actions.refresh);
	});

	it('resolves $expr(...)', () => {
		expect(resolveValue('$expr(hook.stats.total > 100)', ctx)).toBe(true);
	});

	it('returns undefined for missing hook paths', () => {
		expect(resolveValue('$hook.missing', ctx)).toBeUndefined();
	});

	it('resolves $item (whole object)', () => {
		const itemCtx: EvalContext = { ...ctx, item: { name: 'Widget', price: 100 } };
		expect(resolveValue('$item', itemCtx)).toEqual({ name: 'Widget', price: 100 });
	});

	it('resolves $item.name', () => {
		const itemCtx: EvalContext = { ...ctx, item: { name: 'Widget', price: 100 } };
		expect(resolveValue('$item.name', itemCtx)).toBe('Widget');
	});

	it('resolves $item.nested.path', () => {
		const itemCtx: EvalContext = { ...ctx, item: { address: { city: 'Tokyo' } } };
		expect(resolveValue('$item.address.city', itemCtx)).toBe('Tokyo');
	});

	it('returns undefined for $item when no item in context', () => {
		expect(resolveValue('$item.name', ctx)).toBeUndefined();
	});

	it('returns undefined for $item with invalid path', () => {
		const itemCtx: EvalContext = { ...ctx, item: { name: 'Widget' } };
		expect(resolveValue('$item.nonexistent.deep', itemCtx)).toBeUndefined();
	});
});

describe('resolveProps', () => {
	it('resolves all expressions in props', () => {
		const props = {
			data: '$hook.sales',
			title: 'Sales Report',
			total: '$hook.stats.total',
		};
		const resolved = resolveProps(props, ctx);
		expect(resolved.data).toEqual(ctx.hooks.sales);
		expect(resolved.title).toBe('Sales Report');
		expect(resolved.total).toBe(300);
	});
});

describe('evaluateVisibility', () => {
	it('returns true when no condition', () => {
		expect(evaluateVisibility(undefined, ctx)).toBe(true);
	});

	it('evaluates truthy expression', () => {
		expect(evaluateVisibility({ expr: 'hook.stats.total > 0' }, ctx)).toBe(true);
	});

	it('evaluates falsy expression', () => {
		expect(evaluateVisibility({ expr: 'hook.stats.total > 1000' }, ctx)).toBe(false);
	});
});

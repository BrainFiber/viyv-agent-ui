import { describe, expect, it } from 'vitest';
import { isExpression, parseExpression } from '../expression.js';

describe('isExpression', () => {
	it('returns true for $-prefixed strings', () => {
		expect(isExpression('$hook.sales')).toBe(true);
		expect(isExpression('$state.filter')).toBe(true);
	});

	it('returns false for non-expressions', () => {
		expect(isExpression('hello')).toBe(false);
		expect(isExpression(42)).toBe(false);
		expect(isExpression(null)).toBe(false);
	});
});

describe('parseExpression', () => {
	it('parses $hook.xxx', () => {
		const ref = parseExpression('$hook.sales');
		expect(ref).toEqual({ type: 'hook', hookId: 'sales', path: [] });
	});

	it('parses $hook.xxx.data.nested', () => {
		const ref = parseExpression('$hook.sales.data.items');
		expect(ref).toEqual({ type: 'hook', hookId: 'sales', path: ['data', 'items'] });
	});

	it('parses $state.xxx', () => {
		const ref = parseExpression('$state.filter');
		expect(ref).toEqual({ type: 'state', key: 'filter' });
	});

	it('parses $bindState.xxx', () => {
		const ref = parseExpression('$bindState.searchTerm');
		expect(ref).toEqual({ type: 'bindState', key: 'searchTerm' });
	});

	it('parses $action.xxx', () => {
		const ref = parseExpression('$action.refresh');
		expect(ref).toEqual({ type: 'action', actionId: 'refresh' });
	});

	it('parses $expr(...)', () => {
		const ref = parseExpression('$expr(hook.sales.length > 0)');
		expect(ref).toEqual({ type: 'expr', code: 'hook.sales.length > 0' });
	});

	it('parses $hook with deep nesting (a.b.c.d)', () => {
		const ref = parseExpression('$hook.data.a.b.c.d');
		expect(ref).toEqual({ type: 'hook', hookId: 'data', path: ['a', 'b', 'c', 'd'] });
	});

	it('parses hook IDs with hyphens', () => {
		const ref = parseExpression('$hook.my-hook');
		expect(ref).toEqual({ type: 'hook', hookId: 'my-hook', path: [] });
	});

	it('parses state keys with hyphens', () => {
		const ref = parseExpression('$state.my-state');
		expect(ref).toEqual({ type: 'state', key: 'my-state' });
	});

	it('parses action IDs with hyphens', () => {
		const ref = parseExpression('$action.my-action');
		expect(ref).toEqual({ type: 'action', actionId: 'my-action' });
	});

	it('parses $expr with nested parentheses', () => {
		const ref = parseExpression('$expr(Math.max(hook.a, hook.b))');
		expect(ref).toEqual({ type: 'expr', code: 'Math.max(hook.a, hook.b)' });
	});

	it('returns null for invalid expressions', () => {
		expect(parseExpression('$invalid')).toBeNull();
		expect(parseExpression('$')).toBeNull();
		expect(parseExpression('$$hook.x')).toBeNull();
	});
});

import { isExpression, parseExpression } from '@viyv/agent-ui-schema';
import { evaluateSafeExpression } from './safe-expression.js';

export interface EvalContext {
	hooks: Record<string, unknown>;
	state: Record<string, unknown>;
	actions: Record<string, (...args: unknown[]) => void>;
	item?: unknown;
}

/**
 * Resolve a single value: if it's a $-expression, evaluate it; otherwise return as-is.
 */
export function resolveValue(value: unknown, ctx: EvalContext): unknown {
	if (!isExpression(value)) return value;

	const ref = parseExpression(value);
	if (!ref) return value;

	switch (ref.type) {
		case 'hook': {
			let result: unknown = ctx.hooks[ref.hookId];
			for (const key of ref.path) {
				if (result != null && typeof result === 'object') {
					result = (result as Record<string, unknown>)[key];
				} else {
					return undefined;
				}
			}
			return result;
		}
		case 'state':
			return ctx.state[ref.key];
		case 'bindState':
			return ctx.state[ref.key];
		case 'action':
			return ctx.actions[ref.actionId];
		case 'item': {
			let result: unknown = ctx.item;
			for (const key of ref.path) {
				if (result != null && typeof result === 'object') {
					result = (result as Record<string, unknown>)[key];
				} else {
					return undefined;
				}
			}
			return result;
		}
		case 'expr':
			return evaluateSafeExpression(ref.code, ctx);
	}
}

/**
 * Resolve all props of an element, evaluating any $-expressions.
 */
export function resolveProps(
	props: Record<string, unknown>,
	ctx: EvalContext,
): Record<string, unknown> {
	const resolved: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(props)) {
		resolved[key] = resolveValue(value, ctx);
	}
	return resolved;
}

/**
 * Evaluate a visibility condition expression.
 */
export function evaluateVisibility(
	condition: { expr: string } | undefined,
	ctx: EvalContext,
): boolean {
	if (!condition) return true;
	const result = evaluateSafeExpression(condition.expr, ctx);
	return Boolean(result);
}

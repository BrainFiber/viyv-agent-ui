import { z } from 'zod';

// Expression types
export type ExpressionRef =
	| { type: 'hook'; hookId: string; path: string[] }
	| { type: 'state'; key: string }
	| { type: 'bindState'; key: string }
	| { type: 'action'; actionId: string }
	| { type: 'expr'; code: string };

// Pattern matchers — identifiers allow word chars plus hyphens (e.g. "my-hook")
const ID = '[\\w-]+';
const HOOK_PATTERN = new RegExp(`^\\$hook\\.(${ID})(\\.(.+))?$`);
const STATE_PATTERN = new RegExp(`^\\$state\\.(${ID})$`);
const BIND_STATE_PATTERN = new RegExp(`^\\$bindState\\.(${ID})$`);
const ACTION_PATTERN = new RegExp(`^\\$action\\.(${ID})$`);
const EXPR_PATTERN = /^\$expr\((.+)\)$/s;

export function isExpression(value: unknown): value is string {
	return typeof value === 'string' && value.startsWith('$');
}

export function parseExpression(value: string): ExpressionRef | null {
	let match: RegExpMatchArray | null;

	match = value.match(HOOK_PATTERN);
	if (match) {
		const hookId = match[1];
		const rest = match[3];
		const path = rest ? rest.split('.') : [];
		return { type: 'hook', hookId, path };
	}

	match = value.match(STATE_PATTERN);
	if (match) {
		return { type: 'state', key: match[1] };
	}

	match = value.match(BIND_STATE_PATTERN);
	if (match) {
		return { type: 'bindState', key: match[1] };
	}

	match = value.match(ACTION_PATTERN);
	if (match) {
		return { type: 'action', actionId: match[1] };
	}

	match = value.match(EXPR_PATTERN);
	if (match) {
		return { type: 'expr', code: match[1] };
	}

	return null;
}

export const ExpressionStringSchema = z
	.string()
	.refine((val) => !val.startsWith('$') || parseExpression(val) !== null, {
		message: 'Invalid expression syntax',
	});

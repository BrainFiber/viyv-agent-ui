import type { EvalContext } from './expression-evaluator.js';

// Forbidden patterns in expressions
const FORBIDDEN_PATTERNS = [
	/\bfunction\b/,
	/\bnew\b/,
	/\beval\b/,
	/\bFunction\b/,
	/\bimport\b/,
	/\brequire\b/,
	/\bwindow\b/,
	/\bdocument\b/,
	/\bglobal\b/,
	/\bglobalThis\b/,
	/\bprocess\b/,
	/\bthis\b/,
	/\b__proto__\b/,
	/\bconstructor\b/,
	/\bprototype\b/,
	/(?<![!=<>])=(?!=)/, // assignment (but not ==, ===, !=, !==, <=, >=)
	/\+\+/, // increment
	/\b\w+`/, // tagged template literals
];

/** Replace string literal contents with spaces so forbidden-pattern checks skip them. */
function stripStringLiterals(code: string): string {
	return code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) => {
		const quote = match[0];
		return quote + ' '.repeat(match.length - 2) + quote;
	});
}

export function evaluateSafeExpression(code: string, ctx: EvalContext): unknown {
	// Safety check — strip string literals so patterns like = inside URLs aren't rejected
	const codeForCheck = stripStringLiterals(code);
	for (const pattern of FORBIDDEN_PATTERNS) {
		if (pattern.test(codeForCheck)) {
			throw new Error(`Unsafe expression: "${code}" matches forbidden pattern ${pattern.source}`);
		}
	}

	// Build a restricted scope (avoid reserved words as parameter names)
	const scope: Record<string, unknown> = {
		hook: ctx.hooks,
		state: ctx.state,
		item: ctx.item ?? null,
		param: ctx.params ?? {},
		Math,
		Number,
		String,
		Boolean,
		Array,
		Object: { keys: Object.keys, values: Object.values, entries: Object.entries },
		JSON: { parse: JSON.parse, stringify: JSON.stringify },
	};

	const scopeKeys = Object.keys(scope);
	const scopeValues = Object.values(scope);

	try {
		// Create a function with restricted scope
		const fn = new Function(...scopeKeys, `"use strict"; return (${code});`);
		return fn(...scopeValues);
	} catch (err) {
		if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
			console.warn(
				`[agent-ui] Expression error in "${code}":`,
				err instanceof Error ? err.message : String(err),
			);
		}
		return undefined;
	}
}

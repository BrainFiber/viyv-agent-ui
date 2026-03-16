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

export function evaluateSafeExpression(code: string, ctx: EvalContext): unknown {
	// Safety check
	for (const pattern of FORBIDDEN_PATTERNS) {
		if (pattern.test(code)) {
			throw new Error(`Unsafe expression: "${code}" matches forbidden pattern ${pattern.source}`);
		}
	}

	// Build a restricted scope (avoid reserved words as parameter names)
	const scope: Record<string, unknown> = {
		hook: ctx.hooks,
		state: ctx.state,
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
	} catch {
		return undefined;
	}
}

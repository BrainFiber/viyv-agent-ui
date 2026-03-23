import type { ParamDef } from '@viyv/agent-ui-schema';

/** SQL injection patterns — matched as sequences, not individual characters */
const SQL_UNSAFE_PATTERNS = [
	/'/,        // single quote
	/;/,        // statement separator
	/--/,       // line comment
	/\/\*/,     // block comment start
];

const PARAM_PATTERN = /\$param\.([\w-]+)/g;

/**
 * Validate and coerce param values based on ParamDef definitions.
 * Returns a sanitized record of string | number values.
 */
export function validateParamValues(
	values: Record<string, unknown>,
	defs?: Record<string, ParamDef>,
): Record<string, string | number> {
	const result: Record<string, string | number> = {};

	for (const [key, raw] of Object.entries(values)) {
		const def = defs?.[key];
		const expectedType = def?.type ?? 'string';

		if (expectedType === 'number') {
			const num = Number(raw);
			if (!Number.isFinite(num)) {
				throw new Error(`Param "${key}" must be a finite number, got: ${String(raw)}`);
			}
			result[key] = num;
		} else {
			const str = String(raw);
			result[key] = str;
		}
	}

	// Apply defaults for missing params
	if (defs) {
		for (const [key, def] of Object.entries(defs)) {
			if (!(key in result) && def.default !== undefined) {
				result[key] = def.type === 'number' ? Number(def.default) : String(def.default);
			}
		}
	}

	return result;
}

/**
 * Check if a string value contains SQL-unsafe patterns.
 */
function containsSqlUnsafe(value: string): boolean {
	return SQL_UNSAFE_PATTERNS.some((p) => p.test(value));
}

/**
 * Replace $param.key placeholders in a template string.
 *
 * Modes:
 * - 'sql': Rejects string values containing SQL injection patterns (', ;, --, /*)
 * - 'url': Applies encodeURIComponent
 * - 'general': Direct substitution
 */
export function interpolateParams(
	template: string,
	params: Record<string, string | number>,
	mode: 'sql' | 'url' | 'general' = 'general',
): string {
	return template.replace(PARAM_PATTERN, (_match, key: string) => {
		const value = params[key];
		if (value === undefined) return _match; // leave unmatched

		const str = String(value);

		if (mode === 'sql') {
			// Numbers are safe to inline directly
			if (typeof value === 'number') return str;
			// String values must not contain SQL metacharacters
			if (containsSqlUnsafe(str)) {
				throw new Error(
					`Param "${key}" contains unsafe SQL characters: ${str}`,
				);
			}
			return `'${str}'`;
		}

		if (mode === 'url') {
			return encodeURIComponent(str);
		}

		return str;
	});
}

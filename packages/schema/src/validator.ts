import { isExpression, parseExpression } from './expression.js';
import type { HookDef } from './hook-def.js';
import type { PageSpec } from './page-spec.js';
import { PageSpecSchema } from './page-spec.js';

export interface ValidationError {
	path: string;
	message: string;
	severity: 'error' | 'warning';
}

export interface ValidationResult {
	valid: boolean;
	errors: ValidationError[];
	warnings: ValidationError[];
}

export function validatePageSpec(input: unknown): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationError[] = [];

	// 1. Zod schema validation
	const parsed = PageSpecSchema.safeParse(input);
	if (!parsed.success) {
		for (const issue of parsed.error.issues) {
			errors.push({
				path: issue.path.join('.'),
				message: issue.message,
				severity: 'error',
			});
		}
		return { valid: false, errors, warnings };
	}

	const spec = parsed.data;

	// 2. Root element exists
	if (!spec.elements[spec.root]) {
		errors.push({
			path: 'root',
			message: `Root element "${spec.root}" not found in elements`,
			severity: 'error',
		});
	}

	// 3. Children reference integrity
	for (const [id, element] of Object.entries(spec.elements)) {
		if (element.children) {
			for (const childId of element.children) {
				if (!spec.elements[childId]) {
					errors.push({
						path: `elements.${id}.children`,
						message: `Child element "${childId}" not found`,
						severity: 'error',
					});
				}
			}
		}
	}

	// 4. Expression reference validity
	validateExpressions(spec, errors, warnings);

	// 5. Hook dependency validation (dangling references + cycles)
	validateHookDependencies(spec.hooks, errors);
	validateHookCycles(spec.hooks, errors);

	// 6. SQL safety check
	validateSqlSafety(spec.hooks, errors, warnings);

	return {
		valid: errors.length === 0,
		errors,
		warnings,
	};
}

function validateExpressionRef(
	ref: ReturnType<typeof parseExpression>,
	spec: PageSpec,
	path: string,
	errors: ValidationError[],
): void {
	if (!ref) return;
	if (ref.type === 'hook' && !spec.hooks[ref.hookId]) {
		errors.push({
			path,
			message: `Hook "${ref.hookId}" not defined`,
			severity: 'error',
		});
	}
	if (ref.type === 'state' && !(ref.key in spec.state)) {
		errors.push({
			path,
			message: `State key "${ref.key}" not defined`,
			severity: 'error',
		});
	}
	if (ref.type === 'bindState' && !(ref.key in spec.state)) {
		errors.push({
			path,
			message: `State key "${ref.key}" not defined for binding`,
			severity: 'error',
		});
	}
	if (ref.type === 'action' && !spec.actions[ref.actionId]) {
		errors.push({
			path,
			message: `Action "${ref.actionId}" not defined`,
			severity: 'error',
		});
	}
	// $item is validated for Repeater ancestry in validateExpressions
}

function buildParentMap(elements: Record<string, { children?: string[] }>): Record<string, string> {
	const parentMap: Record<string, string> = {};
	for (const [id, element] of Object.entries(elements)) {
		if (element.children) {
			for (const childId of element.children) {
				parentMap[childId] = id;
			}
		}
	}
	return parentMap;
}

function hasRepeaterAncestor(
	elemId: string,
	elements: Record<string, { type: string; children?: string[] }>,
	parentMap: Record<string, string>,
): boolean {
	let current = parentMap[elemId];
	while (current) {
		if (elements[current]?.type === 'Repeater') return true;
		current = parentMap[current];
	}
	return false;
}

function validateExpressions(
	spec: PageSpec,
	errors: ValidationError[],
	warnings: ValidationError[],
): void {
	const parentMap = buildParentMap(spec.elements);

	for (const [elemId, element] of Object.entries(spec.elements)) {
		// Validate prop expressions
		for (const [propKey, propValue] of Object.entries(element.props)) {
			if (isExpression(propValue)) {
				const ref = parseExpression(propValue);
				if (!ref) {
					errors.push({
						path: `elements.${elemId}.props.${propKey}`,
						message: `Invalid expression: ${propValue}`,
						severity: 'error',
					});
					continue;
				}
				validateExpressionRef(ref, spec, `elements.${elemId}.props.${propKey}`, errors);

				if (ref.type === 'item' && !hasRepeaterAncestor(elemId, spec.elements, parentMap)) {
					warnings.push({
						path: `elements.${elemId}.props.${propKey}`,
						message: '$item expression used outside Repeater context',
						severity: 'warning',
					});
				}
			}
		}

		// Validate visibility expression
		if (element.visible) {
			const expr = element.visible.expr;
			if (isExpression(expr)) {
				const ref = parseExpression(expr);
				if (!ref) {
					errors.push({
						path: `elements.${elemId}.visible.expr`,
						message: `Invalid visibility expression: ${expr}`,
						severity: 'error',
					});
				} else {
					validateExpressionRef(ref, spec, `elements.${elemId}.visible.expr`, errors);
				}
			}
		}
	}
}

function validateHookDependencies(hooks: Record<string, HookDef>, errors: ValidationError[]): void {
	for (const [hookId, hook] of Object.entries(hooks)) {
		if (hook.use === 'useDerived' && !hooks[hook.from]) {
			errors.push({
				path: `hooks.${hookId}.from`,
				message: `Derived hook "${hookId}" references undefined source hook "${hook.from}"`,
				severity: 'error',
			});
		}
	}
}

function validateHookCycles(hooks: Record<string, HookDef>, errors: ValidationError[]): void {
	const visited = new Set<string>();
	const inStack = new Set<string>();

	function dfs(hookId: string): boolean {
		if (inStack.has(hookId)) return true;
		if (visited.has(hookId)) return false;

		visited.add(hookId);
		inStack.add(hookId);

		const hook = hooks[hookId];
		if (hook && hook.use === 'useDerived') {
			if (dfs(hook.from)) {
				errors.push({
					path: `hooks.${hookId}`,
					message: `Circular dependency detected involving hook "${hookId}"`,
					severity: 'error',
				});
				return true;
			}
		}

		inStack.delete(hookId);
		return false;
	}

	for (const hookId of Object.keys(hooks)) {
		dfs(hookId);
	}
}

const SQL_DANGEROUS_PATTERNS = [
	/\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE)\b/i,
	/;\s*\w/, // multiple statements
	/--/, // SQL comments (potential injection)
	/\/\*/, // block comments
];

function validateSqlSafety(
	hooks: Record<string, HookDef>,
	errors: ValidationError[],
	_warnings: ValidationError[],
): void {
	for (const [hookId, hook] of Object.entries(hooks)) {
		if (hook.use !== 'useSqlQuery') continue;

		const query = hook.params.query;

		for (const pattern of SQL_DANGEROUS_PATTERNS) {
			if (pattern.test(query)) {
				errors.push({
					path: `hooks.${hookId}.params.query`,
					message: `Potentially unsafe SQL detected: ${pattern.source}`,
					severity: 'error',
				});
			}
		}

		if (!query.trim().toUpperCase().startsWith('SELECT')) {
			errors.push({
				path: `hooks.${hookId}.params.query`,
				message: 'SQL query must start with SELECT',
				severity: 'error',
			});
		}
	}
}

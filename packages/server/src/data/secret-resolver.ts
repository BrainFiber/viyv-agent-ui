/**
 * Resolves `$secret.XXX` references to `process.env[XXX]`.
 *
 * Recursively walks JSON-compatible values (objects, arrays, strings) and
 * replaces any string matching `$secret.ENV_VAR_NAME` with the corresponding
 * environment variable. The env-var name must match `[A-Z_][A-Z0-9_]*` to
 * prevent path-traversal or injection attacks.
 *
 * Throws if a referenced env var is not set.
 */

const SECRET_PATTERN = /^\$secret\.([A-Z_][A-Z0-9_]*)$/;

/**
 * Resolve all `$secret.XXX` references in a JSON-compatible value.
 * Returns a new value tree with secrets replaced by their env-var values.
 */
export function resolveSecrets(value: unknown): unknown {
	if (typeof value === 'string') {
		const match = value.match(SECRET_PATTERN);
		if (match) {
			const envName = match[1];
			const envValue = process.env[envName];
			if (envValue == null) {
				throw new Error(`Secret "${envName}" is not set in environment variables`);
			}
			return envValue;
		}
		return value;
	}

	if (Array.isArray(value)) {
		return value.map(resolveSecrets);
	}

	if (value !== null && typeof value === 'object') {
		const resolved: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
			resolved[key] = resolveSecrets(val);
		}
		return resolved;
	}

	return value;
}

/**
 * Check whether a JSON-compatible value tree contains any `$secret.XXX` references.
 */
export function containsSecrets(value: unknown): boolean {
	if (typeof value === 'string') {
		return SECRET_PATTERN.test(value);
	}

	if (Array.isArray(value)) {
		return value.some(containsSecrets);
	}

	if (value !== null && typeof value === 'object') {
		return Object.values(value as Record<string, unknown>).some(containsSecrets);
	}

	return false;
}

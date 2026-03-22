/**
 * Normalize unknown data to an array of records.
 * Handles both plain arrays and `{ rows: [...] }` wrappers.
 * Logs a warning in development when data is not in an expected format.
 */
export function normalizeData(
	data: unknown,
	componentName: string,
): Record<string, unknown>[] {
	if (Array.isArray(data)) return data as Record<string, unknown>[];
	if (data != null && typeof data === 'object' && 'rows' in data) {
		const rows = (data as { rows: unknown }).rows;
		if (Array.isArray(rows)) return rows as Record<string, unknown>[];
	}
	if (data !== undefined && data !== null) {
		console.warn(
			`[agent-ui] ${componentName}: expected data to be an array or { rows: [...] }, received ${typeof data}`,
		);
	}
	return [];
}

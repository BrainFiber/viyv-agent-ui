export interface RowHighlightRule {
	key: string;
	op: 'eq' | 'neq' | 'lt' | 'gt' | 'lte' | 'gte';
	value?: unknown;
	field?: string;
	className: string;
}

/** 行に最初にマッチするルールの className を返す。マッチなしなら '' */
export function evaluateRowHighlight(
	row: Record<string, unknown>,
	rules: RowHighlightRule[] | undefined,
): string {
	if (!rules || rules.length === 0) return '';

	for (const rule of rules) {
		const lhs = row[rule.key];
		const rhs = rule.field ? row[rule.field] : rule.value;

		const lhsNull = lhs == null;
		const rhsNull = rhs == null;

		if (rule.op === 'eq') {
			// eslint-disable-next-line eqeqeq
			if (lhs == rhs) return rule.className;
			continue;
		}
		if (rule.op === 'neq') {
			// eslint-disable-next-line eqeqeq
			if (lhs != rhs) return rule.className;
			continue;
		}

		// relational ops: if either side is null/undefined → false
		if (lhsNull || rhsNull) continue;

		const lNum = Number(lhs);
		const rNum = Number(rhs);
		const useNum = !Number.isNaN(lNum) && !Number.isNaN(rNum);
		const l = useNum ? lNum : String(lhs);
		const r = useNum ? rNum : String(rhs);

		let match = false;
		switch (rule.op) {
			case 'lt':
				match = l < r;
				break;
			case 'gt':
				match = l > r;
				break;
			case 'lte':
				match = l <= r;
				break;
			case 'gte':
				match = l >= r;
				break;
		}
		if (match) return rule.className;
	}

	return '';
}

export interface DataTableFilterConfig {
	type: 'text' | 'select';
	placeholder?: string;
	options?: { value: string; label: string }[];
}

interface FilterableColumn {
	key: string;
	filter?: DataTableFilterConfig;
}

/** データ行にフィルタを適用。入力が空の列はスキップ。 */
export function applyFilters(
	rows: Record<string, unknown>[],
	columns: readonly FilterableColumn[],
	filters: Record<string, string>,
): Record<string, unknown>[] {
	const activeFilters = columns
		.filter((col) => col.filter && filters[col.key])
		.map((col) => ({ key: col.key, type: col.filter!.type, value: filters[col.key] }));

	if (activeFilters.length === 0) return rows;

	return rows.filter((row) =>
		activeFilters.every(({ key, type, value }) => {
			const cell = row[key];
			if (cell == null) return false;
			const cellStr = String(cell);
			if (type === 'text') {
				return cellStr.toLowerCase().includes(value.toLowerCase());
			}
			// select: exact match
			return cellStr === value;
		}),
	);
}

/** select の options が省略された列に対し、データからユニーク値を導出。 */
export function deriveSelectOptions(
	data: Record<string, unknown>[],
	columns: readonly FilterableColumn[],
): Record<string, { value: string; label: string }[]> {
	const result: Record<string, { value: string; label: string }[]> = {};

	for (const col of columns) {
		if (col.filter?.type !== 'select' || col.filter.options) continue;

		const unique = new Set<string>();
		for (const row of data) {
			const val = row[col.key];
			if (val != null && String(val) !== '') {
				unique.add(String(val));
			}
		}
		result[col.key] = [...unique]
			.sort()
			.map((v) => ({ value: v, label: v }));
	}

	return result;
}

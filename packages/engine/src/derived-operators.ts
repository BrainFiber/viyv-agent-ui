export interface SortParams {
	key: string;
	order: 'asc' | 'desc';
}

export interface FilterParams {
	key: string;
	match: unknown;
}

export interface AggregateParams {
	fn: 'sum' | 'avg' | 'count' | 'min' | 'max';
	key: string;
}

export interface DerivedParams {
	sort?: SortParams;
	filter?: FilterParams;
	limit?: number;
	groupBy?: string;
	aggregate?: AggregateParams;
}

type Row = Record<string, unknown>;

/**
 * Apply derived operations to source data (pure function).
 */
export function applyDerivedOperations(data: unknown, params: DerivedParams): unknown {
	if (!Array.isArray(data)) return data;

	let result: Row[] = [...data] as Row[];

	// Filter
	if (params.filter) {
		const { key, match } = params.filter;
		result = result.filter((row) => {
			const val = row[key];
			if (typeof match === 'string') {
				return String(val).toLowerCase().includes(match.toLowerCase());
			}
			return val === match;
		});
	}

	// Sort
	if (params.sort) {
		const { key, order } = params.sort;
		result.sort((a, b) => {
			const aVal = a[key];
			const bVal = b[key];
			if (aVal == null && bVal == null) return 0;
			if (aVal == null) return 1;
			if (bVal == null) return -1;
			if (aVal < bVal) return order === 'asc' ? -1 : 1;
			if (aVal > bVal) return order === 'asc' ? 1 : -1;
			return 0;
		});
	}

	// GroupBy + Aggregate
	if (params.groupBy) {
		const groups = new Map<string, Row[]>();
		for (const row of result) {
			const groupKey = String(row[params.groupBy] ?? 'null');
			const group = groups.get(groupKey) ?? [];
			group.push(row);
			groups.set(groupKey, group);
		}

		if (params.aggregate) {
			const { fn, key } = params.aggregate;
			result = [...groups.entries()].map(([groupKey, rows]) => ({
				[params.groupBy!]: groupKey,
				[key]: computeAggregate(rows, fn, key),
			}));
		} else {
			result = [...groups.entries()].map(([groupKey, rows]) => ({
				[params.groupBy!]: groupKey,
				_count: rows.length,
				_rows: rows,
			}));
		}
	} else if (params.aggregate) {
		// Aggregate without groupBy returns a single row
		const { fn, key } = params.aggregate;
		return [{ [key]: computeAggregate(result, fn, key) }];
	}

	// Limit
	if (params.limit != null && params.limit > 0) {
		result = result.slice(0, params.limit);
	}

	return result;
}

function computeAggregate(rows: Row[], fn: AggregateParams['fn'], key: string): number | null {
	if (fn === 'count') {
		return rows.length;
	}

	const values = rows.map((r) => Number(r[key])).filter((v) => !Number.isNaN(v));

	if (values.length === 0) {
		return null;
	}

	switch (fn) {
		case 'sum':
			return values.reduce((a, b) => a + b, 0);
		case 'avg':
			return values.reduce((a, b) => a + b, 0) / values.length;
		case 'min':
			return Math.min(...values);
		case 'max':
			return Math.max(...values);
	}
}

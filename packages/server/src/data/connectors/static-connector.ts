import type { DataConnector, DataSourceMeta } from '@viyv/agent-ui-schema';

export interface StaticDataSet {
	name: string;
	description?: string;
	columns: { name: string; type: string }[];
	rows: Record<string, unknown>[];
}

export interface StaticConnectorOptions {
	id: string;
	name: string;
	description?: string;
	datasets: Record<string, StaticDataSet>;
}

export class StaticConnector implements DataConnector {
	readonly meta: DataSourceMeta;
	private datasets: Record<string, StaticDataSet>;

	constructor(options: StaticConnectorOptions) {
		this.datasets = options.datasets;
		this.meta = {
			id: options.id,
			name: options.name,
			type: 'static',
			description: options.description,
			tables: Object.entries(options.datasets).map(([name, ds]) => ({
				name,
				columns: ds.columns.map((c) => ({ name: c.name, type: c.type, nullable: false })),
				description: ds.description,
				rowCount: ds.rows.length,
			})),
		};
	}

	async describe(): Promise<DataSourceMeta> {
		return this.meta;
	}

	async query(params: Record<string, unknown>): Promise<unknown> {
		const table = params.table as string;
		const dataset = this.datasets[table];
		if (!dataset) {
			throw new Error(`Dataset "${table}" not found`);
		}

		let result = [...dataset.rows];

		// Simple filtering
		if (params.where && typeof params.where === 'object') {
			const conditions = params.where as Record<string, unknown>;
			result = result.filter((row) =>
				Object.entries(conditions).every(([key, value]) => row[key] === value),
			);
		}

		// Simple limit
		if (typeof params.limit === 'number') {
			result = result.slice(0, params.limit);
		}

		return result;
	}
}

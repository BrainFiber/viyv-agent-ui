import type { DataConnector, DataSourceMeta } from '@viyv/agent-ui-schema';

export interface RestConnectorOptions {
	id: string;
	name: string;
	description?: string;
	baseUrl: string;
	headers?: Record<string, string>;
	endpoints: {
		path: string;
		method: 'GET' | 'POST';
		description?: string;
	}[];
}

export class RestConnector implements DataConnector {
	readonly meta: DataSourceMeta;
	private baseUrl: string;
	private headers: Record<string, string>;

	constructor(options: RestConnectorOptions) {
		this.baseUrl = options.baseUrl.replace(/\/$/, '');
		this.headers = options.headers ?? {};
		this.meta = {
			id: options.id,
			name: options.name,
			type: 'rest',
			description: options.description,
			endpoints: options.endpoints.map((ep) => ({
				path: ep.path,
				method: ep.method,
				description: ep.description,
			})),
		};
	}

	async describe(): Promise<DataSourceMeta> {
		return this.meta;
	}

	async query(params: Record<string, unknown>): Promise<unknown> {
		const path = params.path as string;
		if (!path || typeof path !== 'string') {
			throw new Error('REST query requires a "path" parameter');
		}
		const method = (params.method as string) ?? 'GET';
		const body = params.body;

		const url = `${this.baseUrl}${path}`;
		const options: RequestInit = {
			method,
			headers: {
				'Content-Type': 'application/json',
				...this.headers,
			},
		};

		if (body && method !== 'GET') {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(url, options);
		if (!response.ok) {
			throw new Error(`REST query failed: ${response.status} ${response.statusText}`);
		}

		return response.json();
	}
}

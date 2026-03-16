export interface ApiClientOptions {
	baseUrl: string;
	apiKey?: string;
}

export class ApiClient {
	private baseUrl: string;
	private headers: Record<string, string>;

	constructor(options: ApiClientOptions) {
		this.baseUrl = options.baseUrl.replace(/\/$/, '');
		this.headers = {
			'Content-Type': 'application/json',
		};
		if (options.apiKey) {
			this.headers.Authorization = `Bearer ${options.apiKey}`;
		}
	}

	async get<T = unknown>(path: string): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method: 'GET',
			headers: this.headers,
		});
		if (!response.ok) {
			const body = await response.text();
			throw new Error(`API GET ${path} failed: ${response.status} - ${body}`);
		}
		return response.json() as Promise<T>;
	}

	async post<T = unknown>(path: string, body?: unknown): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method: 'POST',
			headers: this.headers,
			body: body !== undefined ? JSON.stringify(body) : undefined,
		});
		if (!response.ok) {
			const text = await response.text();
			throw new Error(`API POST ${path} failed: ${response.status} - ${text}`);
		}
		return response.json() as Promise<T>;
	}

	async put<T = unknown>(path: string, body: unknown): Promise<T> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method: 'PUT',
			headers: this.headers,
			body: JSON.stringify(body),
		});
		if (!response.ok) {
			const text = await response.text();
			throw new Error(`API PUT ${path} failed: ${response.status} - ${text}`);
		}
		return response.json() as Promise<T>;
	}

	async delete(path: string): Promise<void> {
		const response = await fetch(`${this.baseUrl}${path}`, {
			method: 'DELETE',
			headers: this.headers,
		});
		if (!response.ok) {
			const text = await response.text();
			throw new Error(`API DELETE ${path} failed: ${response.status} - ${text}`);
		}
	}
}

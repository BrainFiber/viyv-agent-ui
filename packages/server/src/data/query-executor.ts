import type { HookDef, PageStore } from '@viyv/agent-ui-schema';
import type { DataSourceRegistry } from './data-source-registry.js';
import { sanitizeQuery } from './query-sanitizer.js';

export interface HookExecuteRequest {
	pageId: string;
	hookId: string;
	params?: Record<string, unknown>;
}

export interface HookExecuteResult {
	data: unknown;
	hookId: string;
	cached: boolean;
}

export class QueryExecutor {
	constructor(
		private pageStore: PageStore,
		private registry: DataSourceRegistry,
	) {}

	async execute(request: HookExecuteRequest): Promise<HookExecuteResult> {
		// 1. Load spec from store
		const page = await this.pageStore.get(request.pageId);
		if (!page) {
			throw new Error(`Page "${request.pageId}" not found`);
		}

		const hook = page.spec.hooks[request.hookId];
		if (!hook) {
			throw new Error(`Hook "${request.hookId}" not found in page "${request.pageId}"`);
		}

		// 2. Execute based on hook type
		const data = await this.executeHook(hook, request.params);

		return { data, hookId: request.hookId, cached: false };
	}

	async executePreviewHook(
		previewId: string,
		hookId: string,
		params?: Record<string, unknown>,
	): Promise<HookExecuteResult> {
		const spec = await this.pageStore.getPreview(previewId);
		if (!spec) {
			throw new Error(`Preview "${previewId}" not found or expired`);
		}

		const hook = spec.hooks[hookId];
		if (!hook) {
			throw new Error(`Hook "${hookId}" not found in preview "${previewId}"`);
		}

		const data = await this.executeHook(hook, params);
		return { data, hookId, cached: false };
	}

	private async executeHook(hook: HookDef, _params?: Record<string, unknown>): Promise<unknown> {
		switch (hook.use) {
			case 'useState':
				return hook.params.initial;

			case 'useDerived':
				// Derived hooks are computed client-side by engine
				// Server returns the source data
				return null;

			case 'useFetch': {
				let response: Response;
				try {
					response = await fetch(hook.params.url, {
						method: hook.params.method ?? 'GET',
						headers: hook.params.headers,
						body: hook.params.body ? JSON.stringify(hook.params.body) : undefined,
					});
				} catch (err) {
					throw new Error(`Fetch failed: ${err instanceof Error ? err.message : 'network error'}`);
				}
				if (!response.ok) {
					throw new Error(`Fetch failed: ${response.status}`);
				}
				try {
					return await response.json();
				} catch {
					throw new Error('Fetch failed: response is not valid JSON');
				}
			}

			case 'useSqlQuery': {
				const result = sanitizeQuery(hook.params.query);
				if (!result.safe) {
					throw new Error(`Unsafe SQL query: ${result.errors.join(', ')}`);
				}
				const connector = this.registry.get(hook.params.connection);
				if (!connector) {
					throw new Error(`Data source "${hook.params.connection}" not found`);
				}
				return connector.query({ sql: hook.params.query });
			}

			case 'useAgentQuery': {
				let response: Response;
				try {
					response = await fetch(hook.params.endpoint, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(hook.params.query ?? {}),
					});
				} catch (err) {
					throw new Error(
						`Agent query failed: ${err instanceof Error ? err.message : 'network error'}`,
					);
				}
				if (!response.ok) {
					throw new Error(`Agent query failed: ${response.status}`);
				}
				try {
					return await response.json();
				} catch {
					throw new Error('Agent query failed: response is not valid JSON');
				}
			}

			default:
				throw new Error(`Unknown hook type: ${(hook as HookDef).use}`);
		}
	}
}

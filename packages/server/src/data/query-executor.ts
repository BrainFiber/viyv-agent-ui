import type { HookDef, PageStore } from '@viyv/agent-ui-schema';
import type { DataSourceRegistry } from './data-source-registry.js';
import { interpolateParams, validateParamValues } from './param-interpolator.js';
import { sanitizeQuery } from './query-sanitizer.js';
import { resolveSecrets } from './secret-resolver.js';
import { WebSocketManager } from './websocket-manager.js';

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
	private wsManager: WebSocketManager | null;

	constructor(
		private pageStore: PageStore,
		private registry: DataSourceRegistry,
		wsManager?: WebSocketManager,
	) {
		this.wsManager = wsManager ?? null;
	}

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

	private async executeHook(hook: HookDef, params?: Record<string, unknown>): Promise<unknown> {
		// Validate and coerce params if provided
		const safeParams =
			params && Object.keys(params).length > 0 ? validateParamValues(params) : undefined;

		switch (hook.use) {
			case 'useState':
				return hook.params.initial;

			case 'useDerived':
				// Derived hooks are computed client-side by engine
				// Server returns the source data
				return null;

			case 'useFetch': {
				const fetchUrl = safeParams
					? interpolateParams(hook.params.url, safeParams, 'url')
					: hook.params.url;
				let response: Response;
				try {
					response = await fetch(fetchUrl, {
						method: hook.params.method ?? 'GET',
						headers: hook.params.headers,
						body: hook.params.body ? JSON.stringify(hook.params.body) : undefined,
					});
				} catch (err) {
					throw new Error(
						`Fetch failed: ${err instanceof Error ? err.message : 'network error'}`,
					);
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
				const query = safeParams
					? interpolateParams(hook.params.query, safeParams, 'sql')
					: hook.params.query;
				const result = sanitizeQuery(query);
				if (!result.safe) {
					throw new Error(`Unsafe SQL query: ${result.errors.join(', ')}`);
				}
				const connector = this.registry.get(hook.params.connection);
				if (!connector) {
					throw new Error(`Data source "${hook.params.connection}" not found`);
				}
				return connector.query({ sql: query });
			}

			case 'useAgentQuery': {
				const endpoint = safeParams
					? interpolateParams(hook.params.endpoint, safeParams, 'url')
					: hook.params.endpoint;
				let response: Response;
				try {
					response = await fetch(endpoint, {
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

			case 'useWebSocket': {
				if (!this.wsManager) {
					this.wsManager = new WebSocketManager();
				}
				const resolvedSubscribe = hook.params.subscribe
					? (resolveSecrets(hook.params.subscribe) as Record<string, unknown>)
					: undefined;
				const connectionKey = this.wsManager.getOrCreate({
					url: hook.params.url,
					subscribe: resolvedSubscribe,
					bufferSize: hook.params.bufferSize ?? 50,
					messageKey: hook.params.messageKey,
				});
				return this.wsManager.getMessages(connectionKey);
			}

			default:
				throw new Error(`Unknown hook type: ${(hook as HookDef).use}`);
		}
	}
}

import { PageSpecSchema, validatePageSpec } from '@viyv/agent-ui-schema';
import type { PageStore } from '@viyv/agent-ui-schema';
import type { DataSourceRegistry } from '../data/data-source-registry.js';
import { QueryExecutor } from '../data/query-executor.js';

export interface AgentUiHandlerOptions {
	pageStore: PageStore;
	registry: DataSourceRegistry;
	basePath?: string;
}

export interface HandlerRequest {
	method: string;
	path: string;
	body?: unknown;
	query?: Record<string, string>;
}

export interface HandlerResponse {
	status: number;
	body: unknown;
	headers?: Record<string, string>;
}

export function createHandler(options: AgentUiHandlerOptions) {
	const { pageStore, registry } = options;
	const executor = new QueryExecutor(pageStore, registry);

	return async (req: HandlerRequest): Promise<HandlerResponse> => {
		try {
			return await route(req, pageStore, registry, executor);
		} catch (err) {
			// Return known domain errors with their message; hide details of unexpected errors
			if (err instanceof Error) {
				const knownPrefixes = [
					'Page ',
					'Hook ',
					'Preview ',
					'Unsafe SQL',
					'Data source ',
					'Dataset ',
					'Fetch failed',
					'Agent query failed',
					'REST query failed',
					'Unknown hook type',
				];
				const isDomainError = knownPrefixes.some((p) => err.message.startsWith(p));
				if (isDomainError) {
					return json(400, { error: err.message });
				}
			}
			return json(500, { error: 'Internal server error' });
		}
	};
}

async function route(
	req: HandlerRequest,
	pageStore: PageStore,
	registry: DataSourceRegistry,
	executor: QueryExecutor,
): Promise<HandlerResponse> {
	const { method, path } = req;

	// Pages
	if (method === 'GET' && path === '/pages') {
		const pages = await pageStore.list();
		return json(
			200,
			pages.map((p) => ({
				id: p.id,
				title: p.spec.title,
				description: p.spec.description,
				createdAt: p.createdAt.toISOString(),
				updatedAt: p.updatedAt.toISOString(),
			})),
		);
	}

	// Preview routes (must be matched before /pages/:id to avoid "preview" being treated as a page ID)
	if (method === 'POST' && path === '/pages/preview') {
		const result = PageSpecSchema.safeParse(req.body);
		if (!result.success) {
			return json(400, { error: 'Invalid page spec', details: result.error.issues });
		}
		const preview = await pageStore.savePreview(result.data);
		return json(201, {
			previewId: preview.previewId,
			previewUrl: `/pages/preview/${preview.previewId}`,
			expiresAt: preview.expiresAt.toISOString(),
		});
	}

	const previewMatch = path.match(/^\/pages\/preview\/([^/]+)$/);
	if (previewMatch && method === 'GET') {
		const spec = await pageStore.getPreview(previewMatch[1]);
		if (!spec) return json(404, { error: 'Preview not found or expired' });
		return json(200, spec);
	}

	// Page CRUD
	const pageMatch = path.match(/^\/pages\/([^/]+)$/);
	if (pageMatch) {
		const id = pageMatch[1];

		if (method === 'GET') {
			const page = await pageStore.get(id);
			if (!page) return json(404, { error: 'Page not found' });
			return json(200, page.spec);
		}

		if (method === 'PUT') {
			const result = PageSpecSchema.safeParse(req.body);
			if (!result.success) {
				return json(400, { error: 'Invalid page spec', details: result.error.issues });
			}
			const validation = validatePageSpec(result.data);
			if (!validation.valid) {
				return json(400, { error: 'Validation failed', details: validation.errors });
			}
			const page = await pageStore.update(id, result.data);
			return json(200, { id: page.id, updatedAt: page.updatedAt.toISOString() });
		}

		if (method === 'DELETE') {
			await pageStore.delete(id);
			return json(204, null);
		}
	}

	if (method === 'POST' && path === '/pages') {
		const result = PageSpecSchema.safeParse(req.body);
		if (!result.success) {
			return json(400, { error: 'Invalid page spec', details: result.error.issues });
		}
		const validation = validatePageSpec(result.data);
		if (!validation.valid) {
			return json(400, { error: 'Validation failed', details: validation.errors });
		}
		const page = await pageStore.save(result.data);
		return json(201, { id: page.id, createdAt: page.createdAt.toISOString() });
	}

	// Sources
	if (method === 'GET' && path === '/sources') {
		return json(200, registry.list());
	}

	const sourceMatch = path.match(/^\/sources\/([^/]+)$/);
	if (sourceMatch && method === 'GET') {
		const meta = await registry.describe(sourceMatch[1]);
		if (!meta) return json(404, { error: 'Source not found' });
		return json(200, meta);
	}

	const sourceQueryMatch = path.match(/^\/sources\/([^/]+)\/query$/);
	if (sourceQueryMatch && method === 'POST') {
		const connector = registry.get(sourceQueryMatch[1]);
		if (!connector) return json(404, { error: 'Source not found' });
		if (req.body !== undefined && (typeof req.body !== 'object' || req.body === null)) {
			return json(400, { error: 'Request body must be a JSON object' });
		}
		const data = await connector.query((req.body as Record<string, unknown>) ?? {});
		return json(200, { data });
	}

	// Hook execution
	if (method === 'POST' && path === '/hooks/execute') {
		if (!req.body || typeof req.body !== 'object') {
			return json(400, { error: 'Request body is required' });
		}
		const { pageId, hookId, previewId, params } = req.body as Record<string, unknown>;

		if (previewId) {
			if (typeof previewId !== 'string') {
				return json(400, { error: 'previewId must be a string' });
			}
			if (!hookId || typeof hookId !== 'string') {
				return json(400, { error: 'hookId is required and must be a string' });
			}
			const result = await executor.executePreviewHook(
				previewId,
				hookId,
				(params as Record<string, unknown>) ?? undefined,
			);
			return json(200, result);
		}

		if (!pageId || typeof pageId !== 'string') {
			return json(400, { error: 'pageId is required and must be a string' });
		}
		if (!hookId || typeof hookId !== 'string') {
			return json(400, { error: 'hookId is required and must be a string' });
		}

		const result = await executor.execute({
			pageId,
			hookId,
			params: (params as Record<string, unknown>) ?? undefined,
		});
		return json(200, result);
	}

	return json(404, { error: 'Not found' });
}

function json(status: number, body: unknown): HandlerResponse {
	return {
		status,
		body,
		headers: { 'Content-Type': 'application/json' },
	};
}

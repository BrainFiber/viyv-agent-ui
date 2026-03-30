import { PageSpecSchema, validatePageSpec } from '@viyv/agent-ui-schema';
import type { ComponentCatalog, FeedbackStore, PageStore } from '@viyv/agent-ui-schema';
import { serializeCatalog, serializeComponentMeta } from '../catalog/catalog-serializer.js';
import { buildSchemaGuide } from '../catalog/schema-guide.js';
import type { DataSourceRegistry } from '../data/data-source-registry.js';
import { QueryExecutor } from '../data/query-executor.js';
import { MemoryFeedbackStore } from '../store/memory-feedback-store.js';
import { routeFeedback } from './feedback-routes.js';

export interface AgentUiHandlerOptions {
	pageStore: PageStore;
	registry: DataSourceRegistry;
	basePath?: string;
	/** Component catalog for schema info endpoints (GET /catalog/*) */
	catalog?: ComponentCatalog;
	/** Feedback store for annotation system. Defaults to in-memory store. */
	feedbackStore?: FeedbackStore;
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
	const { pageStore, registry, catalog } = options;
	const feedbackStore = options.feedbackStore ?? new MemoryFeedbackStore();
	const executor = new QueryExecutor(pageStore, registry);

	return async (req: HandlerRequest): Promise<HandlerResponse> => {
		try {
			return await route(req, pageStore, executor, catalog, feedbackStore);
		} catch (err) {
			// Return known domain errors with their message; hide details of unexpected errors
			if (err instanceof Error) {
				const knownPrefixes = [
					'Page ',
					'Hook ',
					'Preview ',
					'Feedback ',
					'Unsafe SQL',
					'Data source ',
					'Dataset ',
					'Fetch failed',
					'Agent query failed',
					'REST query failed',
					'Secret ',
					'Unknown hook type',
				];
				const isDomainError = knownPrefixes.some((p) => err.message.startsWith(p));
				if (isDomainError) {
					return json(400, { error: err.message });
				}
			}
			console.error('[agent-ui] Unhandled handler error:', err);
			return json(500, { error: 'Internal server error' });
		}
	};
}

async function route(
	req: HandlerRequest,
	pageStore: PageStore,
	executor: QueryExecutor,
	catalog: ComponentCatalog | undefined,
	feedbackStore: FeedbackStore,
): Promise<HandlerResponse> {
	const { method, path } = req;

	// ── Catalog endpoints ──
	if (method === 'GET' && path === '/catalog/guide') {
		return json(200, buildSchemaGuide(catalog));
	}

	if (method === 'GET' && path === '/catalog/components') {
		if (!catalog) return json(404, { error: 'No component catalog configured' });
		const category = req.query?.category;
		return json(200, { components: serializeCatalog(catalog, category) });
	}

	const catalogMatch = path.match(/^\/catalog\/components\/([^/]+)$/);
	if (method === 'GET' && catalogMatch) {
		if (!catalog) return json(404, { error: 'No component catalog configured' });
		const meta = catalog.components[catalogMatch[1]];
		if (!meta) return json(404, { error: `Component "${catalogMatch[1]}" not found` });
		return json(200, serializeComponentMeta(meta));
	}

	// ── Pages ──
	if (method === 'GET' && path === '/pages') {
		const allPages = await pageStore.list();
		const q = req.query?.q;
		const tag = req.query?.tag;

		let filtered = allPages.map((p) => ({
			id: p.id,
			title: p.spec.title,
			parentId: p.spec.parentId ?? null,
			description: p.spec.description,
			tags: p.spec.meta?.tags,
			createdAt: p.createdAt.toISOString(),
			updatedAt: p.updatedAt.toISOString(),
		}));

		if (q) {
			const lower = q.toLowerCase();
			filtered = filtered.filter(
				(p) =>
					p.title.toLowerCase().includes(lower) ||
					(p.description && p.description.toLowerCase().includes(lower)),
			);
		}

		if (tag) {
			filtered = filtered.filter((p) => p.tags?.includes(tag));
		}

		const pageParam = req.query?.page;
		const limitParam = req.query?.limit;

		if (pageParam || limitParam) {
			const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
			const limit = Math.max(1, parseInt(limitParam ?? '20', 10) || 20);
			const total = filtered.length;
			const start = (page - 1) * limit;
			const data = filtered.slice(start, start + limit);
			return json(200, { data, total, page, limit });
		}

		return json(200, filtered);
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

	// ── Feedback endpoints (delegated) ──
	const fbResult = await routeFeedback(req, feedbackStore);
	if (fbResult) return fbResult;

	return json(404, { error: 'Not found' });
}

function json(status: number, body: unknown): HandlerResponse {
	return {
		status,
		body,
		headers: { 'Content-Type': 'application/json' },
	};
}

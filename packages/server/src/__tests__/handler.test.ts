import { beforeEach, describe, expect, it } from 'vitest';
import { createHandler } from '../api/handler.js';
import type { HandlerRequest } from '../api/handler.js';
import { StaticConnector } from '../data/connectors/static-connector.js';
import { DataSourceRegistry } from '../data/data-source-registry.js';
import { MemoryPageStore } from '../store/memory-page-store.js';

describe('API Handler', () => {
	let handler: (req: HandlerRequest) => Promise<{ status: number; body: unknown }>;
	let store: MemoryPageStore;

	beforeEach(() => {
		store = new MemoryPageStore();
		const registry = new DataSourceRegistry();
		registry.register(
			new StaticConnector({
				id: 'demo',
				name: 'Demo DB',
				datasets: {
					sales: {
						name: 'sales',
						columns: [
							{ name: 'product', type: 'string' },
							{ name: 'amount', type: 'number' },
						],
						rows: [
							{ product: 'Widget', amount: 100 },
							{ product: 'Gadget', amount: 200 },
						],
					},
				},
			}),
		);
		handler = createHandler({ pageStore: store, registry });
	});

	const validSpec = {
		id: 'test',
		title: 'Test',
		root: 'root',
		elements: { root: { type: 'Stack', props: {} } },
		hooks: {},
		state: {},
		actions: {},
	};

	it('POST /pages creates a page', async () => {
		const res = await handler({ method: 'POST', path: '/pages', body: validSpec });
		expect(res.status).toBe(201);
		expect((res.body as Record<string, unknown>).id).toBe('test');
	});

	it('GET /pages lists pages', async () => {
		await store.save(validSpec as any);
		const res = await handler({ method: 'GET', path: '/pages' });
		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(1);
	});

	it('GET /pages/:id returns a page', async () => {
		await store.save(validSpec as any);
		const res = await handler({ method: 'GET', path: '/pages/test' });
		expect(res.status).toBe(200);
		expect((res.body as Record<string, unknown>).title).toBe('Test');
	});

	it('GET /pages/:id returns 404 for missing page', async () => {
		const res = await handler({ method: 'GET', path: '/pages/nope' });
		expect(res.status).toBe(404);
	});

	it('DELETE /pages/:id deletes a page', async () => {
		await store.save(validSpec as any);
		const res = await handler({ method: 'DELETE', path: '/pages/test' });
		expect(res.status).toBe(204);
	});

	it('POST /pages/preview creates a preview', async () => {
		const res = await handler({ method: 'POST', path: '/pages/preview', body: validSpec });
		expect(res.status).toBe(201);
		expect((res.body as Record<string, unknown>).previewId).toBeTruthy();
	});

	it('GET /sources lists data sources', async () => {
		const res = await handler({ method: 'GET', path: '/sources' });
		expect(res.status).toBe(200);
		expect(res.body).toHaveLength(1);
	});

	it('GET /sources/:id describes a source', async () => {
		const res = await handler({ method: 'GET', path: '/sources/demo' });
		expect(res.status).toBe(200);
		expect((res.body as Record<string, unknown>).name).toBe('Demo DB');
	});

	it('POST /sources/:id/query queries a source', async () => {
		const res = await handler({
			method: 'POST',
			path: '/sources/demo/query',
			body: { table: 'sales' },
		});
		expect(res.status).toBe(200);
		expect((res.body as Record<string, unknown>).data).toHaveLength(2);
	});

	it('rejects invalid page spec', async () => {
		const res = await handler({
			method: 'POST',
			path: '/pages',
			body: { title: 'Missing required fields' },
		});
		expect(res.status).toBe(400);
	});

	it('returns 404 for unknown routes', async () => {
		const res = await handler({ method: 'GET', path: '/unknown' });
		expect(res.status).toBe(404);
	});
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiClient } from '../api-client.js';

describe('ApiClient', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('sends GET requests', async () => {
		const mockResponse = { ok: true, json: () => Promise.resolve([{ id: 'test' }]) };
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response);

		const client = new ApiClient({ baseUrl: 'http://localhost:3000/api/agent-ui' });
		const result = await client.get('/sources');

		expect(fetch).toHaveBeenCalledWith(
			'http://localhost:3000/api/agent-ui/sources',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(result).toEqual([{ id: 'test' }]);
	});

	it('sends POST requests with body', async () => {
		const mockResponse = { ok: true, json: () => Promise.resolve({ id: 'new' }) };
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response);

		const client = new ApiClient({ baseUrl: 'http://localhost:3000/api/agent-ui' });
		await client.post('/pages', { title: 'Test' });

		expect(fetch).toHaveBeenCalledWith(
			'http://localhost:3000/api/agent-ui/pages',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ title: 'Test' }),
			}),
		);
	});

	it('includes API key in Authorization header', async () => {
		const mockResponse = { ok: true, json: () => Promise.resolve({}) };
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response);

		const client = new ApiClient({
			baseUrl: 'http://localhost:3000/api/agent-ui',
			apiKey: 'test-key',
		});
		await client.get('/sources');

		expect(fetch).toHaveBeenCalledWith(
			expect.any(String),
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: 'Bearer test-key',
				}),
			}),
		);
	});

	it('throws on non-OK response', async () => {
		const mockResponse = {
			ok: false,
			status: 404,
			text: () => Promise.resolve('Not found'),
		};
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response);

		const client = new ApiClient({ baseUrl: 'http://localhost:3000/api/agent-ui' });
		await expect(client.get('/pages/missing')).rejects.toThrow('404');
	});

	it('sends DELETE requests', async () => {
		const mockResponse = { ok: true };
		vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse as Response);

		const client = new ApiClient({ baseUrl: 'http://localhost:3000/api/agent-ui' });
		await client.delete('/pages/test');

		expect(fetch).toHaveBeenCalledWith(
			'http://localhost:3000/api/agent-ui/pages/test',
			expect.objectContaining({ method: 'DELETE' }),
		);
	});
});

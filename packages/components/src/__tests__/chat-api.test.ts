import { describe, it, expect, vi, beforeEach } from 'vitest';
import { submitTask, openTaskStream, resolveHitlRequest } from '../chat/chat-api.js';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
	mockFetch.mockReset();
});

describe('submitTask', () => {
	it('sends POST to /api/tasks and returns result', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ taskId: 'task_1', traceId: 'trace_1' }),
		});

		const result = await submitTask('http://gw:8080', 'Hello', 'coder', 'ses_1');

		expect(mockFetch).toHaveBeenCalledWith('http://gw:8080/api/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt: 'Hello', agent: 'coder', sessionId: 'ses_1' }),
		});
		expect(result).toEqual({ taskId: 'task_1', traceId: 'trace_1' });
	});

	it('omits agent and sessionId when not provided', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ taskId: 'task_2', traceId: 'trace_2' }),
		});

		await submitTask('http://gw:8080', 'Hi');

		const body = JSON.parse(mockFetch.mock.calls[0][1].body);
		expect(body).toEqual({ prompt: 'Hi' });
		expect(body.agent).toBeUndefined();
		expect(body.sessionId).toBeUndefined();
	});

	it('throws on non-OK response', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 400,
			text: async () => 'Bad Request',
		});

		await expect(submitTask('http://gw:8080', 'Hi')).rejects.toThrow('Task submission failed (400): Bad Request');
	});

	it('throws on network error (fetch rejects)', async () => {
		mockFetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

		await expect(submitTask('http://gw:8080', 'Hi')).rejects.toThrow('Failed to fetch');
	});
});

describe('openTaskStream', () => {
	it('returns response body stream', async () => {
		const mockBody = new ReadableStream();
		mockFetch.mockResolvedValueOnce({
			ok: true,
			body: mockBody,
		});

		const stream = await openTaskStream('http://gw:8080', 'task_1');
		expect(stream).toBe(mockBody);
	});

	it('throws on non-OK response', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 404,
			text: async () => 'Not Found',
		});

		await expect(openTaskStream('http://gw:8080', 'task_x')).rejects.toThrow('Stream failed (404)');
	});

	it('throws when response has no body', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			body: null,
		});

		await expect(openTaskStream('http://gw:8080', 'task_1')).rejects.toThrow('Stream response has no body');
	});

	it('passes abort signal to fetch', async () => {
		const controller = new AbortController();
		const mockBody = new ReadableStream();
		mockFetch.mockResolvedValueOnce({ ok: true, body: mockBody });

		await openTaskStream('http://gw:8080', 'task_1', controller.signal);

		expect(mockFetch.mock.calls[0][1].signal).toBe(controller.signal);
	});
});

describe('resolveHitlRequest', () => {
	it('sends POST to /api/hitl/:id/resolve', async () => {
		mockFetch.mockResolvedValueOnce({ ok: true });

		await resolveHitlRequest('http://gw:8080', 'req_1', { decision: 'approve' });

		expect(mockFetch).toHaveBeenCalledWith('http://gw:8080/api/hitl/req_1/resolve', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ decision: 'approve' }),
		});
	});

	it('throws on non-OK response', async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
			text: async () => 'Internal Error',
		});

		await expect(
			resolveHitlRequest('http://gw:8080', 'req_1', { decision: 'approve' }),
		).rejects.toThrow('HITL resolve failed (500)');
	});
});

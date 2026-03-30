import type { HitlResponse } from './types.js';

export interface SubmitTaskResult {
	taskId: string;
	traceId: string;
}

/**
 * Submit a task to the Gateway.
 * POST /api/tasks
 */
export async function submitTask(
	endpoint: string,
	prompt: string,
	agent?: string,
	sessionId?: string,
): Promise<SubmitTaskResult> {
	const body: Record<string, unknown> = { prompt };
	if (agent) body.agent = agent;
	if (sessionId) body.sessionId = sessionId;

	const res = await fetch(`${endpoint}/api/tasks`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`Task submission failed (${res.status}): ${text}`);
	}

	return res.json() as Promise<SubmitTaskResult>;
}

/**
 * Open an SSE stream for a task.
 * GET /api/tasks/:id/stream
 *
 * Returns the response body as a ReadableStream.
 */
export async function openTaskStream(
	endpoint: string,
	taskId: string,
	signal?: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
	const res = await fetch(`${endpoint}/api/tasks/${taskId}/stream`, {
		signal,
		headers: { Accept: 'text/event-stream' },
	});

	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`Stream failed (${res.status}): ${text}`);
	}

	if (!res.body) {
		throw new Error('Stream response has no body');
	}

	return res.body;
}

/**
 * Resolve a HITL (human-in-the-loop) request.
 * POST /api/hitl/:requestId/resolve
 */
export async function resolveHitlRequest(
	endpoint: string,
	requestId: string,
	response: HitlResponse,
): Promise<void> {
	const res = await fetch(`${endpoint}/api/hitl/${requestId}/resolve`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(response),
	});

	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(`HITL resolve failed (${res.status}): ${text}`);
	}
}

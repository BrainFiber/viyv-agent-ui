import type { FeedbackAuthor, FeedbackStore } from '@viyv/agent-ui-schema';
import type { HandlerRequest, HandlerResponse } from './handler.js';

/** Validate and extract author from request body. Returns null on failure. */
function extractAuthor(
	body: Record<string, unknown>,
): { author: FeedbackAuthor; error?: never } | { author?: never; error: HandlerResponse } {
	const { author } = body;
	if (!author || typeof author !== 'object') {
		return { error: json(400, { error: 'author is required' }) };
	}
	const a = author as Record<string, unknown>;
	if (!a.name || typeof a.name !== 'string') {
		return { error: json(400, { error: 'author.name is required' }) };
	}
	if (!a.type || (a.type !== 'human' && a.type !== 'ai')) {
		return { error: json(400, { error: 'author.type must be "human" or "ai"' }) };
	}
	return { author: { name: a.name, type: a.type as 'human' | 'ai' } };
}

function requireBody(req: HandlerRequest): Record<string, unknown> | HandlerResponse {
	const body = req.body as Record<string, unknown> | undefined;
	if (!body) return json(400, { error: 'Request body is required' });
	return body;
}

export async function routeFeedback(
	req: HandlerRequest,
	feedbackStore: FeedbackStore,
): Promise<HandlerResponse | null> {
	const { method, path } = req;

	// GET /feedback?pageId=X&status=open|resolved
	if (method === 'GET' && path === '/feedback') {
		const pageId = req.query?.pageId;
		if (!pageId) {
			return json(400, { error: 'pageId query parameter is required' });
		}
		const status = req.query?.status as 'open' | 'resolved' | 'completed' | undefined;
		if (status && status !== 'open' && status !== 'resolved' && status !== 'completed') {
			return json(400, { error: 'status must be "open", "resolved", or "completed"' });
		}
		const threads = await feedbackStore.listByPage(pageId, status);
		return json(200, threads);
	}

	// POST /feedback — create thread
	if (method === 'POST' && path === '/feedback') {
		const body = requireBody(req);
		if ('status' in body) return body as HandlerResponse;

		const { pageId, elementId, body: commentBody } = body;
		if (!pageId || typeof pageId !== 'string') {
			return json(400, { error: 'pageId is required' });
		}
		if (!elementId || typeof elementId !== 'string') {
			return json(400, { error: 'elementId is required' });
		}
		const authorResult = extractAuthor(body);
		if (authorResult.error) return authorResult.error;
		if (!commentBody || typeof commentBody !== 'string') {
			return json(400, { error: 'body is required' });
		}

		const thread = await feedbackStore.create({
			pageId,
			elementId,
			author: authorResult.author,
			body: commentBody,
		});
		return json(201, thread);
	}

	// /feedback/:threadId routes
	const threadMatch = path.match(/^\/feedback\/([^/]+)$/);
	if (threadMatch) {
		const threadId = threadMatch[1];

		if (method === 'GET') {
			const thread = await feedbackStore.get(threadId);
			if (!thread) return json(404, { error: 'Feedback thread not found' });
			return json(200, thread);
		}

		if (method === 'DELETE') {
			await feedbackStore.delete(threadId);
			return json(204, null);
		}
	}

	// POST /feedback/:threadId/comments
	const commentMatch = path.match(/^\/feedback\/([^/]+)\/comments$/);
	if (method === 'POST' && commentMatch) {
		const threadId = commentMatch[1];
		const body = requireBody(req);
		if ('status' in body) return body as HandlerResponse;

		const authorResult = extractAuthor(body);
		if (authorResult.error) return authorResult.error;
		const { body: commentBody } = body;
		if (!commentBody || typeof commentBody !== 'string') {
			return json(400, { error: 'body is required' });
		}

		const comment = await feedbackStore.addComment({
			threadId,
			author: authorResult.author,
			body: commentBody,
		});
		return json(201, comment);
	}

	// POST /feedback/:threadId/resolve
	const resolveMatch = path.match(/^\/feedback\/([^/]+)\/resolve$/);
	if (method === 'POST' && resolveMatch) {
		const threadId = resolveMatch[1];
		const body = requireBody(req);
		if ('status' in body) return body as HandlerResponse;

		const authorResult = extractAuthor(body);
		if (authorResult.error) return authorResult.error;
		const { body: commentBody } = body;

		const thread = await feedbackStore.resolve({
			threadId,
			author: authorResult.author,
			body: typeof commentBody === 'string' ? commentBody : undefined,
		});
		return json(200, thread);
	}

	// POST /feedback/:threadId/complete
	const completeMatch = path.match(/^\/feedback\/([^/]+)\/complete$/);
	if (method === 'POST' && completeMatch) {
		const threadId = completeMatch[1];
		const thread = await feedbackStore.complete(threadId);
		return json(200, thread);
	}

	// POST /feedback/:threadId/reopen
	const reopenMatch = path.match(/^\/feedback\/([^/]+)\/reopen$/);
	if (method === 'POST' && reopenMatch) {
		const threadId = reopenMatch[1];
		const thread = await feedbackStore.reopen(threadId);
		return json(200, thread);
	}

	return null;
}

function json(status: number, body: unknown): HandlerResponse {
	return {
		status,
		body,
		headers: { 'Content-Type': 'application/json' },
	};
}

import { createHandler } from './handler.js';
import type { AgentUiHandlerOptions, HandlerRequest } from './handler.js';

export function createAgentUiHandler(options: AgentUiHandlerOptions & { basePath?: string }) {
	const handler = createHandler(options);
	const basePath = options.basePath ?? '/api/agent-ui';

	async function handleRequest(request: Request): Promise<Response> {
		const url = new URL(request.url);
		let path = url.pathname;

		// Strip base path
		if (path.startsWith(basePath)) {
			path = path.slice(basePath.length) || '/';
		}

		let body: unknown = undefined;
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			const text = await request.text();
			if (text.length > 0) {
				try {
					body = JSON.parse(text);
				} catch {
					return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
						status: 400,
						headers: { 'Content-Type': 'application/json' },
					});
				}
			}
		}

		const query: Record<string, string> = {};
		url.searchParams.forEach((value, key) => {
			query[key] = value;
		});

		const req: HandlerRequest = {
			method: request.method,
			path,
			body,
			query,
		};

		const result = await handler(req);

		return new Response(result.body !== null ? JSON.stringify(result.body) : null, {
			status: result.status,
			headers: result.headers ?? {},
		});
	}

	return {
		GET: handleRequest,
		POST: handleRequest,
		PUT: handleRequest,
		DELETE: handleRequest,
	};
}

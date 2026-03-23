import { PageSpecSchema, validatePageSpec } from '@viyv/agent-ui-schema';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ApiClient } from './api-client.js';

export interface McpServerOptions {
	/** Base URL for page links (e.g. "https://example.com"). If set, full URLs are included in responses. */
	baseUrl?: string;
}

export function createMcpServer(client: ApiClient, options?: McpServerOptions): McpServer {
	const server = new McpServer({
		name: 'agent-ui',
		version: '0.1.0',
	});

	const baseUrl = options?.baseUrl?.replace(/\/+$/, '');

	function pageUrl(pageId: string): string {
		return baseUrl ? `${baseUrl}/pages/${pageId}` : `/pages/${pageId}`;
	}

	function previewUrl(previewId: string): string {
		return baseUrl ? `${baseUrl}/preview/${previewId}` : `/preview/${previewId}`;
	}

	// ── Catalog tools ──

	server.tool(
		'list_components',
		'List all available UI component types with descriptions. Optionally filter by category.',
		{ category: z.string().optional().describe('Filter by category (e.g. "input", "layout", "display", "data", "chart", "navigation", "overlay")') },
		async ({ category }) => {
			const query = category ? `?category=${encodeURIComponent(category)}` : '';
			const data = await client.get(`/catalog/components${query}`);
			return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
		},
	);

	server.tool(
		'get_component',
		'Get detailed info about a component type, including all available props with their types and defaults.',
		{ type: z.string().describe('Component type name (e.g. "DataTable", "Button", "Dialog")') },
		async ({ type }) => {
			const data = await client.get(`/catalog/components/${encodeURIComponent(type)}`);
			return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
		},
	);

	server.tool(
		'get_schema_guide',
		'Get a comprehensive guide to PageSpec schema: all hook types, action types, expression syntax, theming options, and component overview.',
		{},
		async () => {
			const data = await client.get('/catalog/guide');
			return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
		},
	);

	// ── Page management tools ──

	server.tool('list_pages', 'List all saved pages.', {}, async () => {
		const pages = await client.get<Array<Record<string, unknown>>>('/pages');
		if (baseUrl && Array.isArray(pages)) {
			for (const page of pages) {
				if (typeof page.id === 'string') {
					page.url = pageUrl(page.id);
				}
			}
		}
		return { content: [{ type: 'text', text: JSON.stringify(pages, null, 2) }] };
	});

	server.tool(
		'get_page',
		'Get the full PageSpec of a saved page.',
		{ pageId: z.string().describe('The page ID to retrieve') },
		async ({ pageId }) => {
			const spec = await client.get(`/pages/${pageId}`);
			const urlLine = baseUrl ? `\nURL: ${pageUrl(pageId)}` : '';
			return {
				content: [{ type: 'text', text: `${JSON.stringify(spec, null, 2)}${urlLine}` }],
			};
		},
	);

	server.tool(
		'save_page',
		'Save a page spec permanently. The page will be accessible at /pages/{id}.',
		{
			spec: z.record(z.unknown()).describe('The PageSpec JSON object'),
		},
		async ({ spec }) => {
			const result = await client.post<{ id: string; createdAt: string }>('/pages', spec);
			return {
				content: [
					{
						type: 'text',
						text: `Page saved successfully!\n\nPage ID: ${result.id}\nCreated at: ${result.createdAt}\nURL: ${pageUrl(result.id)}`,
					},
				],
			};
		},
	);

	server.tool(
		'update_page',
		'Update an existing page spec.',
		{
			pageId: z.string().describe('The page ID to update'),
			spec: z.record(z.unknown()).describe('The updated PageSpec JSON object'),
		},
		async ({ pageId, spec }) => {
			const result = await client.put<{ id: string; updatedAt: string }>(
				`/pages/${pageId}`,
				spec,
			);
			return {
				content: [
					{
						type: 'text',
						text: `Page updated!\n\nPage ID: ${result.id}\nUpdated at: ${result.updatedAt}\nURL: ${pageUrl(result.id)}`,
					},
				],
			};
		},
	);

	server.tool(
		'delete_page',
		'Delete a saved page.',
		{ pageId: z.string().describe('The page ID to delete') },
		async ({ pageId }) => {
			await client.delete(`/pages/${pageId}`);
			return { content: [{ type: 'text', text: `Page "${pageId}" deleted.` }] };
		},
	);

	server.tool(
		'preview_page',
		'Create a temporary preview of a page spec. Returns a preview URL for the user to review.',
		{
			spec: z.record(z.unknown()).describe('The PageSpec JSON object'),
		},
		async ({ spec }) => {
			const result = await client.post<{
				previewId: string;
				previewUrl: string;
				expiresAt: string;
			}>('/pages/preview', spec);
			const url = previewUrl(result.previewId);
			return {
				content: [
					{
						type: 'text',
						text: `Preview created!\n\nPreview URL: ${url}\nExpires at: ${result.expiresAt}\n\nPlease ask the user to open this URL in their browser to review the page.`,
					},
				],
			};
		},
	);

	server.tool(
		'validate_page',
		'Validate a PageSpec JSON object without saving it. Returns schema and semantic validation results.',
		{
			spec: z.record(z.unknown()).describe('The PageSpec JSON object to validate'),
		},
		async ({ spec }) => {
			// 1. Schema validation
			const parsed = PageSpecSchema.safeParse(spec);
			if (!parsed.success) {
				const issues = parsed.error.issues.map(
					(i) => `  - ${i.path.join('.')}: ${i.message}`,
				);
				return {
					content: [
						{
							type: 'text',
							text: `Validation FAILED (schema errors):\n${issues.join('\n')}`,
						},
					],
				};
			}

			// 2. Semantic validation
			const result = validatePageSpec(parsed.data);
			if (!result.valid) {
				const errorLines = result.errors.map(
					(e) => `  - [${e.severity}] ${e.path}: ${e.message}`,
				);
				const warningLines = result.warnings.map(
					(w) => `  - [warning] ${w.path}: ${w.message}`,
				);
				const lines = [...errorLines, ...warningLines];
				return {
					content: [
						{
							type: 'text',
							text: `Validation FAILED:\n${lines.join('\n')}`,
						},
					],
				};
			}

			// 3. Success
			if (result.warnings.length > 0) {
				const warningLines = result.warnings.map(
					(w) => `  - ${w.path}: ${w.message}`,
				);
				return {
					content: [
						{
							type: 'text',
							text: `Validation PASSED with warnings:\n${warningLines.join('\n')}`,
						},
					],
				};
			}

			return {
				content: [{ type: 'text', text: 'Validation PASSED' }],
			};
		},
	);

	// ── Feedback tools ──

	server.tool(
		'feedback_list',
		'List all feedback threads for a page. Returns threads with element IDs, comments, and status. Use this to see what feedback humans have left on UI components.',
		{
			pageId: z.string().describe('The page ID to list feedback for'),
			status: z
				.enum(['open', 'resolved'])
				.optional()
				.describe('Filter by status (omit for all)'),
		},
		async ({ pageId, status }) => {
			let query = `?pageId=${encodeURIComponent(pageId)}`;
			if (status) query += `&status=${encodeURIComponent(status)}`;
			const threads = await client.get(`/feedback${query}`);
			return {
				content: [{ type: 'text', text: JSON.stringify(threads, null, 2) }],
			};
		},
	);

	server.tool(
		'feedback_reply',
		'Reply to an existing feedback thread with a comment. Use this to ask clarifying questions or provide status updates.',
		{
			threadId: z.string().describe('The feedback thread ID to reply to'),
			body: z.string().describe('The reply comment text'),
		},
		async ({ threadId, body }) => {
			const comment = await client.post(
				`/feedback/${encodeURIComponent(threadId)}/comments`,
				{
					author: { name: 'AI Assistant', type: 'ai' },
					body,
				},
			);
			return {
				content: [
					{
						type: 'text',
						text: `Reply added.\n${JSON.stringify(comment, null, 2)}`,
					},
				],
			};
		},
	);

	server.tool(
		'feedback_resolve',
		'Mark a feedback thread as resolved after addressing the feedback. Include a comment explaining what was changed.',
		{
			threadId: z.string().describe('The feedback thread ID to resolve'),
			body: z
				.string()
				.optional()
				.describe('Resolution comment explaining what was changed'),
		},
		async ({ threadId, body }) => {
			const thread = await client.post(
				`/feedback/${encodeURIComponent(threadId)}/resolve`,
				{
					author: { name: 'AI Assistant', type: 'ai' },
					body,
				},
			);
			return {
				content: [
					{
						type: 'text',
						text: `Thread resolved.\n${JSON.stringify(thread, null, 2)}`,
					},
				],
			};
		},
	);

	return server;
}

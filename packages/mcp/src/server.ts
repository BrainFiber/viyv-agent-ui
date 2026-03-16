import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { ApiClient } from './api-client.js';

export function createMcpServer(client: ApiClient): McpServer {
	const server = new McpServer({
		name: 'agent-ui',
		version: '0.1.0',
	});

	// list_data_sources
	server.tool(
		'list_data_sources',
		'List all available data sources (databases, APIs, etc.)',
		{},
		async () => {
			const sources = await client.get('/sources');
			return { content: [{ type: 'text', text: JSON.stringify(sources, null, 2) }] };
		},
	);

	// describe_source
	server.tool(
		'describe_source',
		'Get detailed schema information about a data source (tables, columns, endpoints)',
		{ sourceId: z.string().describe('The data source ID') },
		async ({ sourceId }) => {
			const meta = await client.get(`/sources/${sourceId}`);
			return { content: [{ type: 'text', text: JSON.stringify(meta, null, 2) }] };
		},
	);

	// query_data
	server.tool(
		'query_data',
		'Query sample data from a data source to understand the data shape',
		{
			sourceId: z.string().describe('The data source ID'),
			params: z
				.record(z.unknown())
				.describe('Query parameters (e.g. { table: "sales", limit: 5 })'),
		},
		async ({ sourceId, params }) => {
			const result = await client.post(`/sources/${sourceId}/query`, params);
			return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
		},
	);

	// preview_page
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
			return {
				content: [
					{
						type: 'text',
						text: `Preview created!\n\nPreview URL: ${result.previewUrl}\nExpires at: ${result.expiresAt}\n\nPlease ask the user to open this URL in their browser to review the page.`,
					},
				],
			};
		},
	);

	// save_page
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
						text: `Page saved successfully!\n\nPage ID: ${result.id}\nCreated at: ${result.createdAt}\nURL: /pages/${result.id}`,
					},
				],
			};
		},
	);

	// update_page
	server.tool(
		'update_page',
		'Update an existing page spec.',
		{
			pageId: z.string().describe('The page ID to update'),
			spec: z.record(z.unknown()).describe('The updated PageSpec JSON object'),
		},
		async ({ pageId, spec }) => {
			const result = await client.put<{ id: string; updatedAt: string }>(`/pages/${pageId}`, spec);
			return {
				content: [
					{
						type: 'text',
						text: `Page updated!\n\nPage ID: ${result.id}\nUpdated at: ${result.updatedAt}`,
					},
				],
			};
		},
	);

	// delete_page
	server.tool(
		'delete_page',
		'Delete a saved page.',
		{ pageId: z.string().describe('The page ID to delete') },
		async ({ pageId }) => {
			await client.delete(`/pages/${pageId}`);
			return { content: [{ type: 'text', text: `Page "${pageId}" deleted.` }] };
		},
	);

	// list_pages
	server.tool('list_pages', 'List all saved pages.', {}, async () => {
		const pages = await client.get('/pages');
		return { content: [{ type: 'text', text: JSON.stringify(pages, null, 2) }] };
	});

	return server;
}

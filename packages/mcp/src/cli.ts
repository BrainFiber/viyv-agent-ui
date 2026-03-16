#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ApiClient } from './api-client.js';
import { createMcpServer } from './server.js';

async function main() {
	const apiUrl = process.env.AGENT_UI_API_URL;
	if (!apiUrl) {
		console.error('AGENT_UI_API_URL environment variable is required');
		process.exit(1);
	}

	const client = new ApiClient({
		baseUrl: apiUrl,
		apiKey: process.env.AGENT_UI_API_KEY,
	});

	const server = createMcpServer(client);
	const transport = new StdioServerTransport();
	await server.connect(transport);
}

main().catch((err) => {
	console.error('MCP Server error:', err);
	process.exit(1);
});

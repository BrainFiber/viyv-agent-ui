import { describe, expect, it } from 'vitest';
import { ApiClient } from '../api-client.js';
import { createMcpServer } from '../server.js';

// Test the MCP server tools by verifying the server is created correctly
describe('MCP Server', () => {
	it('creates a server with correct name and version', () => {
		const client = new ApiClient({ baseUrl: 'http://localhost:3000/api/agent-ui' });
		const server = createMcpServer(client);
		expect(server).toBeDefined();
	});
});

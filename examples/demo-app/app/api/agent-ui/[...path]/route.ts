import { createAgentUiHandler } from '@viyv/agent-ui-server/next';
import { pageStore, registry } from '@/lib/agent-ui-config';
import { ensureSeeded } from '@/lib/seed';

await ensureSeeded();

export const { GET, POST, PUT, DELETE } = createAgentUiHandler({
	pageStore,
	registry,
	basePath: '/api/agent-ui',
});

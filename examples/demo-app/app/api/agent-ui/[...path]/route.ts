import { createAgentUiHandler } from '@viyv/agent-ui-server/next';
import type { ComponentCatalog } from '@viyv/agent-ui-schema';
import { pageStore, registry } from '@/lib/agent-ui-config';
import { ensureSeeded } from '@/lib/seed';

await ensureSeeded();

// webpackIgnore tells webpack to skip this import — Node.js resolves it at runtime.
// This avoids pulling React component implementations into the server route bundle.
let catalog: ComponentCatalog | undefined;
try {
	const mod = await import(/* webpackIgnore: true */ '@viyv/agent-ui-components/catalog');
	catalog = mod.defaultCatalog;
} catch (err) {
	console.warn('[agent-ui] Could not load component catalog:', err instanceof Error ? err.message : err);
}

export const { GET, POST, PUT, DELETE } = createAgentUiHandler({
	pageStore,
	registry,
	catalog,
	basePath: '/api/agent-ui',
});

import type { DataConnector } from '@viyv/agent-ui-schema';

const globalForViyvDb = globalThis as typeof globalThis & {
	__viyvDbConnector?: DataConnector | null;
	__viyvDbConnectorPromise?: Promise<DataConnector | null>;
};

export function getViyvDbConnector(): Promise<DataConnector | null> {
	if (globalForViyvDb.__viyvDbConnector !== undefined) {
		return Promise.resolve(globalForViyvDb.__viyvDbConnector);
	}
	if (globalForViyvDb.__viyvDbConnectorPromise) {
		return globalForViyvDb.__viyvDbConnectorPromise;
	}

	globalForViyvDb.__viyvDbConnectorPromise = createConnector();
	return globalForViyvDb.__viyvDbConnectorPromise;
}

async function createConnector(): Promise<DataConnector | null> {
	const postgresUrl = process.env.VIYV_DB_POSTGRES_URL;
	if (!postgresUrl) {
		globalForViyvDb.__viyvDbConnector = null;
		return null;
	}

	try {
		const { createViyvClient, createDataConnector } = await import('viyv-db-client');
		const client = await createViyvClient({
			postgresUrl,
			tenantId: process.env.VIYV_DB_TENANT_ID ?? 'default',
			accessLevel: 'read',
			poolMin: 1,
			poolMax: 3,
		});
		const connector = createDataConnector(client, {
			id: 'viyv-db',
			name: 'Viyv Database',
			description: 'PostgreSQL データソース (viyv-db)',
		});

		const result = connector as unknown as DataConnector;
		globalForViyvDb.__viyvDbConnector = result;
		return result;
	} catch (err) {
		console.error('[viyv-db-connector] Failed to initialize:', err);
		// Don't cache null on error — allow retry on next call
		globalForViyvDb.__viyvDbConnectorPromise = undefined;
		return null;
	}
}

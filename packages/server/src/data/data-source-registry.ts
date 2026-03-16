import type { DataConnector, DataSourceMeta } from '@viyv/agent-ui-schema';

export class DataSourceRegistry {
	private connectors = new Map<string, DataConnector>();

	register(connector: DataConnector): void {
		this.connectors.set(connector.meta.id, connector);
	}

	unregister(id: string): void {
		this.connectors.delete(id);
	}

	list(): DataSourceMeta[] {
		return [...this.connectors.values()].map((c) => c.meta);
	}

	get(id: string): DataConnector | undefined {
		return this.connectors.get(id);
	}

	async describe(id: string): Promise<DataSourceMeta | null> {
		const connector = this.connectors.get(id);
		if (!connector) return null;
		return connector.describe();
	}
}

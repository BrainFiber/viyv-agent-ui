import { MemoryPageStore, DataSourceRegistry, StaticConnector } from '@viyv/agent-ui-server';
import { datasets } from './demo-data';

export const pageStore = new MemoryPageStore();

export const registry = new DataSourceRegistry();
registry.register(
	new StaticConnector({
		id: 'demo-db',
		name: 'デモデータベース',
		description: '商品マスタと売上データ',
		datasets,
	}),
);

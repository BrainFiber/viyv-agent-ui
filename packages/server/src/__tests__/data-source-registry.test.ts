import { describe, expect, it } from 'vitest';
import { StaticConnector } from '../data/connectors/static-connector.js';
import { DataSourceRegistry } from '../data/data-source-registry.js';

describe('DataSourceRegistry', () => {
	it('registers and lists connectors', () => {
		const registry = new DataSourceRegistry();
		registry.register(
			new StaticConnector({
				id: 'test',
				name: 'Test',
				datasets: {},
			}),
		);

		const sources = registry.list();
		expect(sources).toHaveLength(1);
		expect(sources[0].id).toBe('test');
	});

	it('gets a connector by id', () => {
		const registry = new DataSourceRegistry();
		const connector = new StaticConnector({ id: 'test', name: 'Test', datasets: {} });
		registry.register(connector);

		expect(registry.get('test')).toBe(connector);
		expect(registry.get('missing')).toBeUndefined();
	});

	it('unregisters a connector', () => {
		const registry = new DataSourceRegistry();
		registry.register(new StaticConnector({ id: 'test', name: 'Test', datasets: {} }));
		registry.unregister('test');
		expect(registry.list()).toHaveLength(0);
	});

	it('describes a connector', async () => {
		const registry = new DataSourceRegistry();
		registry.register(
			new StaticConnector({
				id: 'db',
				name: 'Database',
				datasets: {
					users: {
						name: 'users',
						columns: [{ name: 'id', type: 'int' }],
						rows: [],
					},
				},
			}),
		);

		const meta = await registry.describe('db');
		expect(meta).not.toBeNull();
		expect(meta!.tables).toHaveLength(1);
	});
});

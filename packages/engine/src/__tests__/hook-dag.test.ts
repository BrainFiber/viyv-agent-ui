import type { HookDef } from '@viyv/agent-ui-schema';
import { describe, expect, it } from 'vitest';
import { buildHookDAG } from '../hook-dag.js';

describe('buildHookDAG', () => {
	it('builds a simple DAG with no dependencies', () => {
		const hooks: Record<string, HookDef> = {
			sales: {
				use: 'useSqlQuery',
				params: { connection: 'db', query: 'SELECT * FROM sales' },
			},
			users: {
				use: 'useFetch',
				params: { url: 'https://api.example.com/users', method: 'GET' },
			},
		};

		const dag = buildHookDAG(hooks);
		expect(dag.layers).toHaveLength(1);
		expect(dag.layers[0]).toHaveLength(2);
		expect(dag.order).toHaveLength(2);
	});

	it('orders derived hooks after their sources', () => {
		const hooks: Record<string, HookDef> = {
			raw: {
				use: 'useSqlQuery',
				params: { connection: 'db', query: 'SELECT * FROM sales' },
			},
			sorted: {
				use: 'useDerived',
				from: 'raw',
				params: { sort: { key: 'amount', order: 'desc' } },
			},
			top5: { use: 'useDerived', from: 'sorted', params: { limit: 5 } },
		};

		const dag = buildHookDAG(hooks);
		expect(dag.layers).toHaveLength(3);
		expect(dag.layers[0]).toEqual(['raw']);
		expect(dag.layers[1]).toEqual(['sorted']);
		expect(dag.layers[2]).toEqual(['top5']);
	});

	it('groups independent hooks in the same layer', () => {
		const hooks: Record<string, HookDef> = {
			raw: {
				use: 'useSqlQuery',
				params: { connection: 'db', query: 'SELECT * FROM sales' },
			},
			filteredA: {
				use: 'useDerived',
				from: 'raw',
				params: { filter: { key: 'region', match: 'east' } },
			},
			filteredB: {
				use: 'useDerived',
				from: 'raw',
				params: { filter: { key: 'region', match: 'west' } },
			},
		};

		const dag = buildHookDAG(hooks);
		expect(dag.layers).toHaveLength(2);
		expect(dag.layers[0]).toEqual(['raw']);
		expect(dag.layers[1].sort()).toEqual(['filteredA', 'filteredB']);
	});

	it('throws on circular dependencies', () => {
		const hooks: Record<string, HookDef> = {
			a: { use: 'useDerived', from: 'b', params: {} },
			b: { use: 'useDerived', from: 'a', params: {} },
		};

		expect(() => buildHookDAG(hooks)).toThrow('Circular dependency');
	});

	it('handles empty hooks', () => {
		const dag = buildHookDAG({});
		expect(dag.layers).toHaveLength(0);
		expect(dag.order).toHaveLength(0);
	});
});

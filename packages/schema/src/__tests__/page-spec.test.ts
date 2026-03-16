import { describe, expect, it } from 'vitest';
import { PageSpecSchema } from '../page-spec.js';

describe('PageSpecSchema', () => {
	it('validates a minimal page spec', () => {
		const spec = {
			id: 'test-page',
			title: 'Test Page',
			root: 'root',
			elements: {
				root: { type: 'Stack', props: { direction: 'vertical' } },
			},
		};

		const result = PageSpecSchema.safeParse(spec);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.id).toBe('test-page');
			expect(result.data.hooks).toEqual({});
			expect(result.data.state).toEqual({});
			expect(result.data.actions).toEqual({});
		}
	});

	it('validates a full page spec with hooks and actions', () => {
		const spec = {
			id: 'sales-dashboard',
			title: 'Sales Dashboard',
			description: 'Monthly sales overview',
			root: 'root',
			elements: {
				root: {
					type: 'Stack',
					props: { direction: 'vertical' },
					children: ['header', 'table'],
				},
				header: { type: 'Header', props: { title: 'Sales' } },
				table: {
					type: 'DataTable',
					props: { data: '$hook.sales', columns: [] },
				},
			},
			hooks: {
				sales: {
					use: 'useSqlQuery',
					params: {
						connection: 'main-db',
						query: 'SELECT * FROM sales',
						refreshInterval: 60000,
					},
				},
			},
			state: { filter: '' },
			actions: {
				refresh: { type: 'refreshHook', hookId: 'sales' },
			},
			theme: { colorScheme: 'light', spacing: 'default' },
		};

		const result = PageSpecSchema.safeParse(spec);
		expect(result.success).toBe(true);
	});

	it('rejects invalid hook definitions', () => {
		const spec = {
			id: 'test',
			title: 'Test',
			root: 'root',
			elements: { root: { type: 'Stack', props: {} } },
			hooks: {
				bad: { use: 'useInvalid', params: {} },
			},
		};

		const result = PageSpecSchema.safeParse(spec);
		expect(result.success).toBe(false);
	});
});

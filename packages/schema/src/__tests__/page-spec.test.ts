import { describe, expect, it } from 'vitest';
import { ActionDefSchema } from '../action-def.js';
import { PageSpecSchema } from '../page-spec.js';
import { validatePageSpec } from '../validator.js';

describe('ActionDefSchema — CRUD actions', () => {
	it('parses addItem action', () => {
		const result = ActionDefSchema.safeParse({
			type: 'addItem',
			hookId: 'tasks',
			stateKey: 'newTask',
			idPrefix: 'TASK',
		});
		expect(result.success).toBe(true);
	});

	it('parses removeItem action', () => {
		const result = ActionDefSchema.safeParse({
			type: 'removeItem',
			hookId: 'tasks',
			key: 'id',
			stateKey: 'editingTask',
		});
		expect(result.success).toBe(true);
	});

	it('parses updateItem action', () => {
		const result = ActionDefSchema.safeParse({
			type: 'updateItem',
			hookId: 'tasks',
			key: 'id',
			stateKey: 'editingTask',
			onComplete: { showEditDialog: false },
		});
		expect(result.success).toBe(true);
	});

	it('parses setState with onComplete', () => {
		const result = ActionDefSchema.safeParse({
			type: 'setState',
			key: 'showDialog',
			value: true,
			onComplete: { newTask: { title: '' } },
		});
		expect(result.success).toBe(true);
	});

	it('rejects addItem without required hookId', () => {
		const result = ActionDefSchema.safeParse({
			type: 'addItem',
			stateKey: 'newTask',
		});
		expect(result.success).toBe(false);
	});

	it('rejects removeItem without required key', () => {
		const result = ActionDefSchema.safeParse({
			type: 'removeItem',
			hookId: 'tasks',
			stateKey: 'editingTask',
		});
		expect(result.success).toBe(false);
	});

	it('rejects updateItem without required stateKey', () => {
		const result = ActionDefSchema.safeParse({
			type: 'updateItem',
			hookId: 'tasks',
			key: 'id',
		});
		expect(result.success).toBe(false);
	});
});

describe('validatePageSpec — CRUD hookId validation', () => {
	const baseSpec = {
		id: 'test',
		title: 'Test',
		root: 'root',
		elements: { root: { type: 'Stack', props: {} } },
		state: {},
	};

	it('errors when hookId references undefined hook', () => {
		const result = validatePageSpec({
			...baseSpec,
			hooks: {},
			actions: {
				add: { type: 'addItem', hookId: 'missing', stateKey: 'x' },
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('"missing" not defined'))).toBe(true);
	});

	it('errors when hookId references non-useState hook', () => {
		const result = validatePageSpec({
			...baseSpec,
			hooks: {
				derived: { use: 'useDerived', from: 'tasks', params: {} },
				tasks: { use: 'useState', params: { initial: [] } },
			},
			actions: {
				add: { type: 'addItem', hookId: 'derived', stateKey: 'x' },
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('not useState'))).toBe(true);
	});

	it('passes when hookId references useState hook', () => {
		const result = validatePageSpec({
			...baseSpec,
			hooks: {
				tasks: { use: 'useState', params: { initial: [] } },
			},
			actions: {
				add: { type: 'addItem', hookId: 'tasks', stateKey: 'newTask' },
			},
		});
		expect(result.valid).toBe(true);
	});

	it('errors for removeItem targeting non-useState hook', () => {
		const result = validatePageSpec({
			...baseSpec,
			hooks: {
				tasks: { use: 'useState', params: { initial: [] } },
				derived: { use: 'useDerived', from: 'tasks', params: {} },
			},
			actions: {
				remove: { type: 'removeItem', hookId: 'derived', key: 'id', stateKey: 'x' },
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('not useState'))).toBe(true);
	});

	it('errors for updateItem targeting undefined hook', () => {
		const result = validatePageSpec({
			...baseSpec,
			hooks: {},
			actions: {
				update: { type: 'updateItem', hookId: 'missing', key: 'id', stateKey: 'x' },
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('"missing" not defined'))).toBe(true);
	});

	it('does not validate refreshHook hookId against useState', () => {
		const result = validatePageSpec({
			...baseSpec,
			hooks: {
				data: {
					use: 'useSqlQuery',
					params: { connection: 'db', query: 'SELECT 1' },
				},
			},
			actions: {
				refresh: { type: 'refreshHook', hookId: 'data' },
			},
		});
		expect(result.valid).toBe(true);
	});
});

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

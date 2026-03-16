import { describe, expect, it } from 'vitest';
import { validatePageSpec } from '../validator.js';

describe('validatePageSpec', () => {
	const validSpec = {
		id: 'test',
		title: 'Test',
		root: 'root',
		elements: {
			root: {
				type: 'Stack',
				props: { direction: 'vertical' },
				children: ['header'],
			},
			header: { type: 'Header', props: { title: 'Hello' } },
		},
		hooks: {},
		state: {},
		actions: {},
	};

	it('validates a correct spec', () => {
		const result = validatePageSpec(validSpec);
		expect(result.valid).toBe(true);
		expect(result.errors).toHaveLength(0);
	});

	it('detects missing root element', () => {
		const result = validatePageSpec({
			...validSpec,
			root: 'nonexistent',
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('Root element'))).toBe(true);
	});

	it('detects missing child references', () => {
		const result = validatePageSpec({
			...validSpec,
			elements: {
				root: {
					type: 'Stack',
					props: {},
					children: ['missing-child'],
				},
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('Child element'))).toBe(true);
	});

	it('detects undefined hook references', () => {
		const result = validatePageSpec({
			...validSpec,
			elements: {
				root: {
					type: 'DataTable',
					props: { data: '$hook.nonexistent' },
				},
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('Hook "nonexistent"'))).toBe(true);
	});

	it('detects unsafe SQL', () => {
		const result = validatePageSpec({
			...validSpec,
			hooks: {
				bad: {
					use: 'useSqlQuery',
					params: {
						connection: 'db',
						query: 'DROP TABLE users',
					},
				},
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('unsafe SQL'))).toBe(true);
	});

	it('detects hook cycle', () => {
		const result = validatePageSpec({
			...validSpec,
			hooks: {
				a: { use: 'useDerived', from: 'b', params: {} },
				b: { use: 'useDerived', from: 'a', params: {} },
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('Circular dependency'))).toBe(true);
	});

	it('validates action references in elements', () => {
		const result = validatePageSpec({
			...validSpec,
			elements: {
				root: {
					type: 'Button',
					props: { onClick: '$action.nonexistent' },
				},
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('Action "nonexistent"'))).toBe(true);
	});

	it('rejects non-SELECT SQL queries', () => {
		const result = validatePageSpec({
			...validSpec,
			hooks: {
				insert: {
					use: 'useSqlQuery',
					params: {
						connection: 'db',
						query: 'INSERT INTO users VALUES (1)',
					},
				},
			},
		});
		expect(result.valid).toBe(false);
	});

	it('detects dangling useDerived source', () => {
		const result = validatePageSpec({
			...validSpec,
			hooks: {
				derived: { use: 'useDerived', from: 'nonexistent', params: {} },
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.message.includes('undefined source hook'))).toBe(true);
	});

	it('validates visibility expression hook references', () => {
		const result = validatePageSpec({
			...validSpec,
			elements: {
				root: {
					type: 'Stack',
					props: {},
					visible: { expr: '$hook.nonexistent' },
				},
			},
		});
		expect(result.valid).toBe(false);
		expect(result.errors.some((e) => e.path.includes('visible.expr'))).toBe(true);
	});
});

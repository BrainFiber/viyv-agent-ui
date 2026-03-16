import { describe, expect, it } from 'vitest';
import { defaultRegistry } from '../registry.js';

describe('defaultRegistry', () => {
	it('contains all registered components', () => {
		const types = [
			'Stack',
			'Grid',
			'Card',
			'Header',
			'Text',
			'Stat',
			'Badge',
			'Link',
			'Alert',
			'Divider',
			'DataTable',
			'Button',
			'TextInput',
			'Select',
		];
		for (const type of types) {
			expect(defaultRegistry.has(type), `Missing component: ${type}`).toBe(true);
		}
	});

	it('has exactly 14 components', () => {
		expect(defaultRegistry.size).toBe(14);
	});
});

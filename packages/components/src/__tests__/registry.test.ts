import { describe, expect, it } from 'vitest';
import { defaultRegistry } from '../registry.js';

describe('defaultRegistry', () => {
	it('contains all registered components', () => {
		const types = [
			'Stack',
			'Grid',
			'Card',
			'Tabs',
			'Header',
			'Text',
			'Stat',
			'Badge',
			'Link',
			'Alert',
			'Divider',
			'Image',
			'Map',
			'DataTable',
			'BarChart',
			'LineChart',
			'AreaChart',
			'PieChart',
			'Button',
			'TextInput',
			'Select',
		];
		for (const type of types) {
			expect(defaultRegistry.has(type), `Missing component: ${type}`).toBe(true);
		}
	});

	it('has exactly 21 components', () => {
		expect(defaultRegistry.size).toBe(21);
	});
});

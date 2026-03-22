import { describe, expect, it } from 'vitest';
import { defaultRegistry } from '../registry.js';

describe('defaultRegistry', () => {
	it('contains all registered components', () => {
		const types = [
			'Stack',
			'Grid',
			'Card',
			'Tabs',
			'Dialog',
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
			'TreeList',
			'BarChart',
			'LineChart',
			'AreaChart',
			'PieChart',
			'GanttChart',
			'ProgressBar',
			'Button',
			'TextInput',
			'Select',
			'Textarea',
			'Checkbox',
			'RadioGroup',
			'Avatar',
			'Switch',
			'Slider',
			'Tag',
			'Empty',
			'Skeleton',
			'Spinner',
			'Collapse',
			'Drawer',
			'Breadcrumbs',
			'Stepper',
			'Toast',
			'List',
			'Carousel',
			'Descriptions',
			'Menu',
			'Autocomplete',
			'Rating',
			'Tooltip',
			'Calendar',
		];
		for (const type of types) {
			expect(defaultRegistry.has(type), `Missing component: ${type}`).toBe(true);
		}
	});

	it('has exactly 48 components', () => {
		expect(defaultRegistry.size).toBe(48);
	});
});

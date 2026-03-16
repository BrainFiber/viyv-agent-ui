import { defineCatalog } from '@viyv/agent-ui-schema';
import { z } from 'zod';

export const defaultCatalog = defineCatalog([
	{
		type: 'Stack',
		label: 'Stack',
		description: 'Vertical or horizontal stack layout',
		category: 'layout',
		propsSchema: z.object({
			direction: z.enum(['vertical', 'horizontal']).default('vertical'),
			gap: z.number().default(16),
		}),
		acceptsChildren: true,
	},
	{
		type: 'Grid',
		label: 'Grid',
		description: 'Grid layout with configurable columns',
		category: 'layout',
		propsSchema: z.object({
			columns: z.number().default(2),
			gap: z.number().default(16),
		}),
		acceptsChildren: true,
	},
	{
		type: 'Card',
		label: 'Card',
		description: 'Container card with optional title',
		category: 'layout',
		propsSchema: z.object({
			title: z.string().optional(),
			description: z.string().optional(),
		}),
		acceptsChildren: true,
	},
	{
		type: 'Header',
		label: 'Header',
		description: 'Page or section header',
		category: 'display',
		propsSchema: z.object({
			title: z.string(),
			subtitle: z.string().optional(),
			level: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
		}),
		acceptsChildren: false,
	},
	{
		type: 'Text',
		label: 'Text',
		description: 'Text content',
		category: 'display',
		propsSchema: z.object({
			content: z.string(),
		}),
		acceptsChildren: false,
	},
	{
		type: 'Stat',
		label: 'Stat',
		description: 'Statistic display with label, value, and optional trend',
		category: 'display',
		propsSchema: z.object({
			label: z.string(),
			value: z.unknown(),
			format: z.enum(['number', 'currency', 'percent']).optional(),
			trend: z
				.object({
					direction: z.enum(['up', 'down']),
					value: z.string(),
				})
				.optional(),
		}),
		acceptsChildren: false,
	},
	{
		type: 'DataTable',
		label: 'Data Table',
		description: 'Sortable, filterable data table with row linking and click handling',
		category: 'data',
		propsSchema: z.object({
			data: z.unknown(),
			columns: z.array(
				z.object({
					key: z.string(),
					label: z.string(),
					sortable: z.boolean().optional(),
					format: z.enum(['currency', 'number', 'percent', 'date', 'badge']).optional(),
					filter: z
						.object({
							type: z.enum(['text', 'select']),
							placeholder: z.string().optional(),
							options: z
								.array(z.object({ value: z.string(), label: z.string() }))
								.optional(),
						})
						.optional(),
					badgeMap: z.record(z.enum(['gray', 'blue', 'green', 'yellow', 'red'])).optional(),
					truncate: z.boolean().optional(),
					emptyValue: z.string().optional(),
					valueClassName: z.record(z.string()).optional(),
				}),
			),
			rowHref: z.string().optional(),
			onRowClick: z.unknown().optional(),
			keyField: z.string().optional(),
			emptyMessage: z.string().optional(),
			noMatchMessage: z.string().optional(),
			rowHighlight: z.array(z.object({
				key: z.string(),
				op: z.enum(['eq', 'neq', 'lt', 'gt', 'lte', 'gte']),
				value: z.unknown().optional(),
				field: z.string().optional(),
				className: z.string(),
			})).optional(),
		}),
		acceptsChildren: false,
	},
	{
		type: 'Badge',
		label: 'Badge',
		description: 'Status or category badge',
		category: 'display',
		propsSchema: z.object({
			text: z.string(),
			color: z.enum(['gray', 'blue', 'green', 'yellow', 'red']).default('gray'),
		}),
		acceptsChildren: false,
	},
	{
		type: 'Link',
		label: 'Link',
		description: 'Text hyperlink',
		category: 'display',
		propsSchema: z.object({
			href: z.string(),
			label: z.string(),
			external: z.boolean().optional(),
		}),
		acceptsChildren: false,
	},
	{
		type: 'Alert',
		label: 'Alert',
		description: 'Feedback message (info, success, warning, error)',
		category: 'display',
		propsSchema: z.object({
			message: z.string(),
			type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
			title: z.string().optional(),
		}),
		acceptsChildren: false,
	},
	{
		type: 'Divider',
		label: 'Divider',
		description: 'Visual section separator',
		category: 'display',
		propsSchema: z.object({}),
		acceptsChildren: false,
	},
	{
		type: 'Button',
		label: 'Button',
		description: 'Clickable button',
		category: 'input',
		propsSchema: z.object({
			label: z.string(),
			variant: z.enum(['primary', 'secondary', 'danger']).default('primary'),
		}),
		acceptsChildren: false,
	},
	{
		type: 'TextInput',
		label: 'Text Input',
		description: 'Text input field',
		category: 'input',
		propsSchema: z.object({
			label: z.string().optional(),
			placeholder: z.string().optional(),
		}),
		acceptsChildren: false,
	},
	{
		type: 'Select',
		label: 'Select',
		description: 'Dropdown select',
		category: 'input',
		propsSchema: z.object({
			options: z.array(z.object({ value: z.string(), label: z.string() })),
			placeholder: z.string().optional(),
			label: z.string().optional(),
		}),
		acceptsChildren: false,
	},
]);

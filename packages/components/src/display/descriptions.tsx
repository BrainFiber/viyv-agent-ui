import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface DescriptionsProps {
	items: Array<{ label: string; value: string }>;
	columns?: number;
	bordered?: boolean;
	layout?: 'horizontal' | 'vertical';
	title?: string;
	className?: string;
}

export function Descriptions({
	items,
	columns = 1,
	bordered,
	layout = 'horizontal',
	title,
	className,
}: DescriptionsProps) {
	return (
		<div className={cn(className)}>
			{title && <h3 className="mb-3 text-base font-semibold text-fg">{title}</h3>}
			<dl
				aria-label={title}
				className={cn(
					'grid gap-4',
					bordered && 'rounded-lg border p-4',
				)}
				style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
			>
				{items.map((item, i) => {
					const isLastRow = i >= items.length - (items.length % columns || columns);
					return (
					<div
						key={item.label}
						aria-label={`${item.label}: ${item.value}`}
						className={cn(
							layout === 'horizontal' ? 'flex items-baseline gap-4' : '',
							bordered && !isLastRow && 'border-b pb-3',
						)}
					>
						<dt className={cn(
							'text-sm font-medium text-fg-muted',
							layout === 'horizontal' && 'w-1/3 shrink-0',
						)}>
							{item.label}
						</dt>
						<dd className="text-sm text-fg">{item.value}</dd>
					</div>
					);
				})}
			</dl>
		</div>
	);
}

export const descriptionsMeta: ComponentMeta = {
	type: 'Descriptions',
	label: 'Descriptions',
	description: 'Key-value detail display',
	category: 'display',
	propsSchema: z.object({
		items: z.array(z.object({ label: z.string(), value: z.string() })),
		columns: z.number().optional(),
		bordered: z.boolean().optional(),
		layout: z.enum(['horizontal', 'vertical']).optional(),
		title: z.string().optional(),
	}),
	acceptsChildren: false,
};

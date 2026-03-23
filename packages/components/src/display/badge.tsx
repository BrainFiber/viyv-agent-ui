import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';

const badgeVariants = cva(
	'inline-flex whitespace-nowrap w-fit h-fit rounded-full font-medium',
	{
		variants: {
			color: {
				gray: 'bg-muted text-fg-secondary border border-border',
				blue: 'bg-primary-soft text-primary-soft-fg border border-primary-soft-border',
				green: 'bg-success-soft text-success-soft-fg border border-success-soft-border',
				yellow: 'bg-warning-soft text-warning-soft-fg border border-warning-soft-border',
				red: 'bg-danger-soft text-danger-soft-fg border border-danger-soft-border',
			},
			size: {
				sm: 'px-2 py-px text-[10px]',
				md: 'px-2.5 py-0.5 text-xs',
			},
		},
		defaultVariants: { color: 'gray', size: 'md' },
	},
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
	text: string;
	color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red';
	size?: 'sm' | 'md';
	className?: string;
}

export function Badge({ text, color, size, className }: BadgeProps) {
	return (
		<span className={cn(badgeVariants({ color, size }), className)}>
			{text}
		</span>
	);
}

export { badgeVariants };

export const badgeMeta: ComponentMeta = {
	type: 'Badge',
	label: 'Badge',
	description: 'Status or category badge',
	category: 'display',
	propsSchema: z.object({
		text: z.string(),
		color: z.enum(['gray', 'blue', 'green', 'yellow', 'red']).default('gray'),
		size: z.enum(['sm', 'md']).default('md'),
	}),
	acceptsChildren: false,
};

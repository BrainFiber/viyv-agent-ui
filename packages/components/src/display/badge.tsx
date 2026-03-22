import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface BadgeProps {
	text: string;
	color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red';
	className?: string;
}

const colorMap: Record<string, string> = {
	gray: 'bg-muted text-fg-secondary border border-border',
	blue: 'bg-primary-soft text-primary-soft-fg border border-primary-soft-border',
	green: 'bg-success-soft text-success-soft-fg border border-success-soft-border',
	yellow: 'bg-warning-soft text-warning-soft-fg border border-warning-soft-border',
	red: 'bg-danger-soft text-danger-soft-fg border border-danger-soft-border',
};

export function Badge({ text, color = 'gray', className }: BadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex whitespace-nowrap w-fit h-fit rounded-full px-2.5 py-0.5 text-xs font-medium',
				colorMap[color] ?? colorMap.gray,
				className,
			)}
		>
			{text}
		</span>
	);
}

export const badgeMeta: ComponentMeta = {
	type: 'Badge',
	label: 'Badge',
	description: 'Status or category badge',
	category: 'display',
	propsSchema: z.object({
		text: z.string(),
		color: z.enum(['gray', 'blue', 'green', 'yellow', 'red']).default('gray'),
	}),
	acceptsChildren: false,
};

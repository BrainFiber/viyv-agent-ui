import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface TagProps {
	label: string;
	color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple';
	removable?: boolean;
	onRemove?: () => void;
	className?: string;
}

const colorMap: Record<string, string> = {
	gray: 'bg-muted text-fg-secondary border border-border',
	blue: 'bg-primary-soft text-primary-soft-fg border border-primary-soft-border',
	green: 'bg-success-soft text-success-soft-fg border border-success-soft-border',
	yellow: 'bg-warning-soft text-warning-soft-fg border border-warning-soft-border',
	red: 'bg-danger-soft text-danger-soft-fg border border-danger-soft-border',
	purple: 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800',
};

export function Tag({ label, color = 'gray', removable, onRemove, className }: TagProps) {
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
				colorMap[color] ?? colorMap.gray,
				className,
			)}
		>
			{label}
			{removable && (
				<button
					type="button"
					onClick={onRemove}
					aria-label={`Remove ${label}`}
					className="ml-0.5 inline-flex shrink-0 rounded-full p-0.5 hover:bg-black/10"
				>
					&#x2715;
				</button>
			)}
		</span>
	);
}

export const tagMeta: ComponentMeta = {
	type: 'Tag',
	label: 'Tag',
	description: 'Removable label tag',
	category: 'display',
	propsSchema: z.object({
		label: z.string(),
		color: z.enum(['gray', 'blue', 'green', 'yellow', 'red', 'purple']).optional(),
		removable: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

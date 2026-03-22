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
	gray: 'bg-gray-100 text-gray-700',
	blue: 'bg-blue-100 text-blue-700',
	green: 'bg-green-100 text-green-700',
	yellow: 'bg-yellow-100 text-yellow-700',
	red: 'bg-red-100 text-red-700',
	purple: 'bg-purple-100 text-purple-700',
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

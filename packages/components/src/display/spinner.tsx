import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { Loader2 } from '../lib/icons.js';

export interface SpinnerProps {
	size?: 'sm' | 'md' | 'lg';
	label?: string;
	className?: string;
}

const sizeMap: Record<string, string> = {
	sm: 'h-4 w-4',
	md: 'h-8 w-8',
	lg: 'h-12 w-12',
};

export function Spinner({ size = 'md', label, className }: SpinnerProps) {
	return (
		<div
			role="status"
			aria-label={label ?? 'Loading'}
			className={cn('flex flex-col items-center justify-center gap-2', className)}
		>
			<Loader2
				aria-hidden="true"
				className={cn('animate-spin text-primary', sizeMap[size] ?? sizeMap.md)}
			/>
			{label && <span className="text-sm text-fg-muted">{label}</span>}
		</div>
	);
}

export const spinnerMeta: ComponentMeta = {
	type: 'Spinner',
	label: 'Spinner',
	description: 'Loading spinner indicator',
	category: 'display',
	propsSchema: z.object({
		size: z.enum(['sm', 'md', 'lg']).optional(),
		label: z.string().optional(),
	}),
	acceptsChildren: false,
};

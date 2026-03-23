import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import * as P from '../ui/progress.js';

export interface ProgressProps {
	value: number;
	label?: string;
	color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
	size?: 'sm' | 'md' | 'lg';
	showValue?: boolean;
	className?: string;
}

const colorMap: Record<string, string> = {
	blue: 'bg-primary',
	green: 'bg-success',
	yellow: 'bg-warning',
	red: 'bg-danger',
	gray: 'bg-fg-subtle',
};

const sizeMap: Record<string, string> = {
	sm: 'h-1.5',
	md: 'h-2.5',
	lg: 'h-4',
};

function resolveValue(value: unknown): number {
	// Handle aggregate results like Stat does: [{ key_fn: 42 }] → 42
	if (Array.isArray(value) && value.length > 0) {
		const first = value[0];
		if (first && typeof first === 'object') {
			const vals = Object.values(first as Record<string, unknown>);
			if (vals.length > 0) return Number(vals[0]) || 0;
		}
	}
	const n = Number(value);
	return Number.isNaN(n) ? 0 : n;
}

export function Progress({ value, label, color = 'blue', size = 'md', showValue, className }: ProgressProps) {
	const clamped = Math.round(Math.max(0, Math.min(100, resolveValue(value))));
	return (
		<div className={cn('flex items-center gap-2', className)}>
			<P.Root
				value={clamped}
				aria-label={label ?? `${clamped}%`}
				className={cn('relative', sizeMap[size] ?? sizeMap.md)}
			>
				<P.Indicator
					style={{ transform: `translateX(-${100 - clamped}%)` }}
					className={colorMap[color] ?? colorMap.blue}
				/>
			</P.Root>
			{showValue && <span className="text-sm font-medium text-fg-secondary shrink-0">{clamped}%</span>}
		</div>
	);
}

export const progressMeta: ComponentMeta = {
	type: 'Progress',
	label: 'Progress',
	description: 'Progress indicator with value, color, and optional percentage display',
	category: 'display',
	propsSchema: z.object({
		value: z.number(),
		label: z.string().optional(),
		color: z.enum(['blue', 'green', 'yellow', 'red', 'gray']).optional(),
		size: z.enum(['sm', 'md', 'lg']).optional(),
		showValue: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

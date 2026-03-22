import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface ProgressBarProps {
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

export function ProgressBar({ value, label, color = 'blue', size = 'md', showValue, className }: ProgressBarProps) {
	const clamped = Math.round(Math.max(0, Math.min(100, resolveValue(value))));
	return (
		<div className={cn('flex items-center gap-2', className)}>
			<div
				className={cn('w-full rounded-full bg-muted overflow-hidden', sizeMap[size] ?? sizeMap.md)}
				role="progressbar"
				aria-valuenow={clamped}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={label ?? `${clamped}%`}
			>
				<div
					className={cn('h-full rounded-full transition-all duration-500', colorMap[color] ?? colorMap.blue)}
					style={{ width: `${clamped}%` }}
				/>
			</div>
			{showValue && <span className="text-sm font-medium text-fg-secondary shrink-0">{clamped}%</span>}
		</div>
	);
}

export const progressBarMeta: ComponentMeta = {
	type: 'ProgressBar',
	label: 'Progress Bar',
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

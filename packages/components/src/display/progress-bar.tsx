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
	blue: 'bg-blue-500',
	green: 'bg-green-500',
	yellow: 'bg-yellow-500',
	red: 'bg-red-500',
	gray: 'bg-gray-500',
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
				className={cn('w-full rounded-full bg-gray-200 overflow-hidden', sizeMap[size] ?? sizeMap.md)}
				role="progressbar"
				aria-valuenow={clamped}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label={label ?? `${clamped}%`}
			>
				<div
					className={cn('h-full rounded-full transition-all', colorMap[color] ?? colorMap.blue)}
					style={{ width: `${clamped}%` }}
				/>
			</div>
			{showValue && <span className="text-sm font-medium text-gray-700 shrink-0">{clamped}%</span>}
		</div>
	);
}

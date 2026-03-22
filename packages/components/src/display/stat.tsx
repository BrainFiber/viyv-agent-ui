import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface StatProps {
	label: string;
	value: unknown;
	format?: 'number' | 'currency' | 'percent';
	trend?: { direction: 'up' | 'down'; value: string; color?: 'green' | 'red' | 'auto' };
	className?: string;
}

function formatValue(value: unknown, format?: string): string {
	if (value == null) return '-';

	// Handle array result from aggregate (e.g., [{ amount: 250 }])
	let val: unknown = value;
	if (Array.isArray(val) && val.length === 1 && typeof val[0] === 'object' && val[0] !== null) {
		const obj = val[0] as Record<string, unknown>;
		const keys = Object.keys(obj);
		if (keys.length > 0) {
			val = obj[keys[0]];
		}
	}

	const num = Number(val);
	if (Number.isNaN(num)) return String(val);

	switch (format) {
		case 'currency':
			return new Intl.NumberFormat('ja-JP', {
				style: 'currency',
				currency: 'JPY',
			}).format(num);
		case 'percent':
			return `${(num * 100).toFixed(1)}%`;
		case 'number':
			return new Intl.NumberFormat('ja-JP').format(num);
		default:
			return String(val);
	}
}

export function Stat({ label, value, format, trend, className }: StatProps) {
	return (
		<div className={cn('rounded-xl border bg-surface p-5 shadow-sm', className)}>
			<p className="text-sm text-fg-muted">{label}</p>
			<div className="mt-1 flex items-baseline gap-2">
				<p className="text-2xl font-bold tracking-tight">{formatValue(value, format)}</p>
				{trend && (
					<span
						className={cn(
							'text-sm font-medium',
							(() => {
								const c = trend.color ?? 'auto';
								if (c === 'green') return 'text-success';
								if (c === 'red') return 'text-danger';
								return trend.direction === 'up' ? 'text-success' : 'text-danger';
							})(),
						)}
						aria-label={`${trend.direction === 'up' ? '上昇' : '下降'} ${trend.value}`}
					>
						{trend.direction === 'up' ? '\u2191' : '\u2193'} {trend.value}
					</span>
				)}
			</div>
		</div>
	);
}

export const statMeta: ComponentMeta = {
	type: 'Stat',
	label: 'Stat',
	description: 'Statistic display with label, value, and optional trend',
	category: 'display',
	propsSchema: z.object({
		label: z.string(),
		value: z.unknown(),
		format: z.enum(['number', 'currency', 'percent']).optional(),
		trend: z.object({
			direction: z.enum(['up', 'down']),
			value: z.string(),
			color: z.enum(['green', 'red', 'auto']).optional(),
		}).optional(),
	}),
	acceptsChildren: false,
};

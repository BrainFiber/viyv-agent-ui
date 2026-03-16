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
		<div className={cn('rounded-lg border bg-white p-4', className)}>
			<p className="text-sm text-gray-500">{label}</p>
			<div className="mt-1 flex items-baseline gap-2">
				<p className="text-2xl font-semibold">{formatValue(value, format)}</p>
				{trend && (
					<span
						className={cn(
							'text-sm font-medium',
							(() => {
								const c = trend.color ?? 'auto';
								if (c === 'green') return 'text-green-600';
								if (c === 'red') return 'text-red-600';
								return trend.direction === 'up' ? 'text-green-600' : 'text-red-600';
							})(),
						)}
					>
						{trend.direction === 'up' ? '\u2191' : '\u2193'} {trend.value}
					</span>
				)}
			</div>
		</div>
	);
}

import { cn } from '../lib/cn.js';

export interface TextProps {
	content: string;
	variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'price';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	weight?: 'normal' | 'medium' | 'semibold' | 'bold';
	color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
	truncate?: boolean | number;
	className?: string;
}

const variantDefaults: Record<string, { size: string; weight: string; color: string }> = {
	heading: { size: 'text-xl', weight: 'font-bold', color: 'text-gray-900' },
	subheading: { size: 'text-lg', weight: 'font-semibold', color: 'text-gray-800' },
	body: { size: 'text-base', weight: 'font-normal', color: 'text-gray-700' },
	caption: { size: 'text-sm', weight: 'font-normal', color: 'text-gray-500' },
	price: { size: 'text-lg', weight: 'font-bold', color: 'text-gray-900' },
};

const sizeMap: Record<string, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
	'2xl': 'text-2xl',
};

const weightMap: Record<string, string> = {
	normal: 'font-normal',
	medium: 'font-medium',
	semibold: 'font-semibold',
	bold: 'font-bold',
};

const colorMap: Record<string, string> = {
	default: 'text-gray-700',
	muted: 'text-gray-500',
	primary: 'text-blue-600',
	success: 'text-green-600',
	warning: 'text-yellow-600',
	danger: 'text-red-600',
};

function getTruncateClass(truncate?: boolean | number): string | undefined {
	if (truncate === true) return 'truncate';
	if (typeof truncate === 'number' && truncate > 0) return `line-clamp-${truncate}`;
	return undefined;
}

export function Text({ content, variant, size, weight, color, truncate, className }: TextProps) {
	const defaults = variant ? variantDefaults[variant] : undefined;

	const sizeClass = size ? sizeMap[size] : defaults?.size;
	const weightClass = weight ? weightMap[weight] : defaults?.weight;
	const colorClass = color ? colorMap[color] : (defaults?.color ?? 'text-gray-700');
	const truncateClass = getTruncateClass(truncate);

	return (
		<p className={cn(sizeClass, weightClass, colorClass, truncateClass, className)}>
			{content}
		</p>
	);
}

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { CSSProperties } from 'react';
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
	heading: { size: 'text-xl', weight: 'font-bold', color: 'text-fg' },
	subheading: { size: 'text-lg', weight: 'font-semibold', color: 'text-fg' },
	body: { size: 'text-base', weight: 'font-normal', color: 'text-fg-secondary' },
	caption: { size: 'text-sm', weight: 'font-normal', color: 'text-fg-muted' },
	price: { size: 'text-lg', weight: 'font-bold', color: 'text-fg' },
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
	default: 'text-fg-secondary',
	muted: 'text-fg-muted',
	primary: 'text-primary',
	success: 'text-success',
	warning: 'text-warning',
	danger: 'text-danger',
};

function getTruncateStyles(truncate?: boolean | number): { className?: string; style?: CSSProperties } {
	if (truncate === true) return { className: 'truncate' };
	if (typeof truncate === 'number' && truncate > 0) {
		return {
			style: {
				display: '-webkit-box',
				WebkitLineClamp: truncate,
				WebkitBoxOrient: 'vertical' as const,
				overflow: 'hidden',
			},
		};
	}
	return {};
}

export function Text({ content, variant, size, weight, color, truncate, className }: TextProps) {
	const defaults = variant ? variantDefaults[variant] : undefined;

	const sizeClass = size ? sizeMap[size] : defaults?.size;
	const weightClass = weight ? weightMap[weight] : defaults?.weight;
	const colorClass = color ? colorMap[color] : (defaults?.color ?? 'text-fg-secondary');
	const truncStyles = getTruncateStyles(truncate);

	return (
		<p
			className={cn(sizeClass, weightClass, colorClass, truncStyles.className, className)}
			style={truncStyles.style}
		>
			{content}
		</p>
	);
}

export const textMeta: ComponentMeta = {
	type: 'Text',
	label: 'Text',
	description: 'Styled text content with variant, size, weight, and truncation support',
	category: 'display',
	propsSchema: z.object({
		content: z.string(),
		variant: z.enum(['heading', 'subheading', 'body', 'caption', 'price']).optional(),
		size: z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl']).optional(),
		weight: z.enum(['normal', 'medium', 'semibold', 'bold']).optional(),
		color: z.enum(['default', 'muted', 'primary', 'success', 'warning', 'danger']).optional(),
		truncate: z.union([z.boolean(), z.number()]).optional(),
	}),
	acceptsChildren: false,
};

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { CSSProperties } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';

const textVariants = cva('', {
	variants: {
		variant: {
			heading: 'text-xl font-bold text-fg',
			subheading: 'text-lg font-semibold text-fg',
			body: 'text-base font-normal text-fg-secondary',
			caption: 'text-sm font-normal text-fg-muted',
			price: 'text-lg font-bold text-fg',
		},
		size: {
			xs: 'text-xs',
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl',
		},
		weight: {
			normal: 'font-normal',
			medium: 'font-medium',
			semibold: 'font-semibold',
			bold: 'font-bold',
		},
		color: {
			default: 'text-fg-secondary',
			muted: 'text-fg-muted',
			primary: 'text-primary',
			success: 'text-success',
			warning: 'text-warning',
			danger: 'text-danger',
		},
	},
});

export interface TextProps extends VariantProps<typeof textVariants> {
	content: string;
	variant?: 'heading' | 'subheading' | 'body' | 'caption' | 'price';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	weight?: 'normal' | 'medium' | 'semibold' | 'bold';
	color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
	truncate?: boolean | number;
	className?: string;
}

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
	/* When no variant is set and no color override, default to text-fg-secondary */
	const effectiveColor = color ?? (!variant ? 'default' : undefined);
	const truncStyles = getTruncateStyles(truncate);

	return (
		<p
			className={cn(
				textVariants({ variant: variant ?? null, size: size ?? null, weight: weight ?? null, color: effectiveColor ?? null }),
				truncStyles.className,
				className,
			)}
			style={truncStyles.style}
		>
			{content}
		</p>
	);
}

export { textVariants };

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

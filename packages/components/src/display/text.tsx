import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { CSSProperties } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';

const textVariants = cva('', {
	variants: {
		variant: {
			display: 'text-4xl md:text-5xl font-bold tracking-tight text-fg',
			heading: 'text-xl font-bold text-fg',
			subheading: 'text-lg font-semibold text-fg',
			body: 'text-base font-normal text-fg-secondary',
			caption: 'text-sm font-normal text-fg-muted',
			price: 'text-lg font-bold text-fg',
			overline: 'text-xs uppercase tracking-widest font-semibold text-fg-muted',
		},
		size: {
			xs: 'text-xs',
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
			'2xl': 'text-2xl',
			'3xl': 'text-3xl',
			'4xl': 'text-4xl',
			'5xl': 'text-5xl',
			'6xl': 'text-6xl',
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
		letterSpacing: {
			tighter: 'tracking-tighter',
			tight: 'tracking-tight',
			normal: 'tracking-normal',
			wide: 'tracking-wide',
			wider: 'tracking-wider',
			widest: 'tracking-widest',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right',
		},
	},
});

export interface TextProps extends VariantProps<typeof textVariants> {
	content: string;
	variant?: 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'price' | 'overline';
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
	weight?: 'normal' | 'medium' | 'semibold' | 'bold';
	color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
	letterSpacing?: 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
	align?: 'left' | 'center' | 'right';
	as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div';
	truncate?: boolean | number;
	textGradient?: { from: string; to: string; direction?: string };
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

function getTextGradientStyle(textGradient?: TextProps['textGradient']): CSSProperties | undefined {
	if (!textGradient) return undefined;
	const { from, to, direction } = textGradient;
	return {
		background: `linear-gradient(${direction ?? 'to right'}, ${from}, ${to})`,
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		backgroundClip: 'text',
	};
}

export function Text({
	content, variant, size, weight, color, letterSpacing, align,
	as, truncate, textGradient, className,
}: TextProps) {
	/* When no variant is set and no color override, default to text-fg-secondary */
	const effectiveColor = color ?? (!variant ? 'default' : undefined);
	const truncStyles = getTruncateStyles(truncate);
	const gradientStyle = getTextGradientStyle(textGradient);

	const Tag = as ?? 'p';

	return (
		<Tag
			className={cn(
				textVariants({
					variant: variant ?? null,
					size: size ?? null,
					weight: weight ?? null,
					color: effectiveColor ?? null,
					letterSpacing: letterSpacing ?? null,
					align: align ?? null,
				}),
				truncStyles.className,
				className,
			)}
			style={{ ...truncStyles.style, ...gradientStyle }}
		>
			{content}
		</Tag>
	);
}

export { textVariants };

export const textMeta: ComponentMeta = {
	type: 'Text',
	label: 'Text',
	description: 'Styled text with variant (display, heading, overline, etc.), size, weight, alignment, text gradient, and semantic HTML tag support',
	category: 'display',
	propsSchema: z.object({
		content: z.string(),
		variant: z.enum(['display', 'heading', 'subheading', 'body', 'caption', 'price', 'overline']).optional(),
		size: z.enum(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl']).optional(),
		weight: z.enum(['normal', 'medium', 'semibold', 'bold']).optional(),
		color: z.enum(['default', 'muted', 'primary', 'success', 'warning', 'danger']).optional(),
		letterSpacing: z.enum(['tighter', 'tight', 'normal', 'wide', 'wider', 'widest']).optional(),
		align: z.enum(['left', 'center', 'right']).optional(),
		as: z.enum(['p', 'h1', 'h2', 'h3', 'h4', 'span', 'div']).optional(),
		truncate: z.union([z.boolean(), z.number()]).optional(),
		textGradient: z.object({
			from: z.string(),
			to: z.string(),
			direction: z.string().optional(),
		}).optional(),
	}),
	acceptsChildren: false,
};

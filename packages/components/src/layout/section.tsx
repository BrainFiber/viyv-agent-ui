import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';
import { buildCommonLayoutStyle, buildBgStyle, MAX_WIDTH_MAP, bgGradientPropsSchema, bgImagePropsSchema, hoverEffectPropsSchema } from '../lib/layout-style.js';
import type { CommonLayoutProps, BgGradientProps, BgImageProps } from '../lib/layout-style.js';
import { useAnimation } from '../lib/use-animation.js';
import { animationPropsSchema, type AnimationProps } from '../lib/animation-style.js';

const sectionVariants = cva('', {
	variants: {
		variant: {
			hero: 'py-24 md:py-32',
			content: 'py-16 md:py-20',
			feature: 'py-16 md:py-24',
			cta: 'py-12 md:py-16 text-center',
			footer: 'py-8 md:py-12',
		},
		minHeight: {
			auto: '',
			screen: 'min-h-screen',
			half: 'min-h-[50vh]',
		},
	},
});

const ALIGN_MAP: Record<string, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
};

const JUSTIFY_MAP: Record<string, string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
};

const OVERLAY_MAP: Record<string, string> = {
	dark: 'bg-black/40',
	light: 'bg-white/40',
};

export interface SectionProps extends CommonLayoutProps, BgGradientProps, BgImageProps, AnimationProps {
	variant?: 'hero' | 'content' | 'feature' | 'cta' | 'footer';
	bgOverlay?: 'none' | 'light' | 'dark';
	minHeight?: 'auto' | 'screen' | 'half';
	align?: 'start' | 'center' | 'end';
	justify?: 'start' | 'center' | 'end';
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
	children?: ReactNode;
	className?: string;
}

export function Section({
	variant,
	bgOverlay,
	minHeight,
	align,
	justify,
	maxWidth,
	// Common layout
	p, px, py, bg, rounded, shadow, border, hoverEffect,
	// Background
	bgGradient, bgImage,
	// Animation
	animate, animateDelay, animateDuration, animateOnScroll,
	// Standard
	children, className,
}: SectionProps) {
	const common = buildCommonLayoutStyle({ p, px, py, bg, rounded, shadow, border, hoverEffect });
	const bgStyle = buildBgStyle({ bgGradient, bgImage });
	const anim = useAnimation({ animate, animateDelay, animateDuration, animateOnScroll });

	const showOverlay = bgOverlay && bgOverlay !== 'none' && (bgImage || bgGradient) && OVERLAY_MAP[bgOverlay];

	const innerStyle = maxWidth
		? { maxWidth: MAX_WIDTH_MAP[maxWidth] ?? MAX_WIDTH_MAP.lg, margin: '0 auto' as const, width: '100%' }
		: undefined;

	return (
		<section
			ref={anim.ref as React.RefObject<HTMLElement>}
			className={cn(
				'relative w-full overflow-hidden',
				sectionVariants({ variant: variant ?? null, minHeight: minHeight ?? null }),
				common.className,
				className,
			)}
			style={{ ...common.style, ...bgStyle.style, ...anim.style }}
		>
			{showOverlay && (
				<div className={cn('absolute inset-0 z-0', OVERLAY_MAP[bgOverlay])} aria-hidden="true" />
			)}
			<div
				className={cn(
					'relative z-10 flex flex-col',
					align && ALIGN_MAP[align],
					justify && JUSTIFY_MAP[justify],
				)}
				style={innerStyle}
			>
				{children}
			</div>
		</section>
	);
}

export const sectionMeta: ComponentMeta = {
	type: 'Section',
	label: 'Section',
	description: 'Full-bleed page section with gradient/image backgrounds, overlay, and variant presets (hero, content, feature, cta, footer)',
	category: 'layout',
	propsSchema: z.object({
		variant: z.enum(['hero', 'content', 'feature', 'cta', 'footer']).optional(),
		bgOverlay: z.enum(['none', 'light', 'dark']).optional(),
		minHeight: z.enum(['auto', 'screen', 'half']).optional(),
		align: z.enum(['start', 'center', 'end']).optional(),
		justify: z.enum(['start', 'center', 'end']).optional(),
		maxWidth: z.enum(['sm', 'md', 'lg', 'xl', '2xl', 'full']).optional(),
		p: z.number().optional(),
		px: z.number().optional(),
		py: z.number().optional(),
		bg: z.string().optional(),
		rounded: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).optional(),
		shadow: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
		border: z.boolean().optional(),
	}).merge(bgGradientPropsSchema).merge(bgImagePropsSchema).merge(hoverEffectPropsSchema).merge(animationPropsSchema),
	acceptsChildren: true,
};

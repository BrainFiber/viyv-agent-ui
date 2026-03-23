import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { buildCommonLayoutStyle, buildBoxLayoutStyle, buildBgStyle, bgGradientPropsSchema, bgImagePropsSchema, hoverEffectPropsSchema } from '../lib/layout-style.js';
import type { CommonLayoutProps, BoxLayoutProps, BgGradientProps, BgImageProps } from '../lib/layout-style.js';
import { useAnimation } from '../lib/use-animation.js';
import { animationPropsSchema, type AnimationProps } from '../lib/animation-style.js';

export interface BoxProps extends CommonLayoutProps, BoxLayoutProps, BgGradientProps, BgImageProps, AnimationProps {
	children?: ReactNode;
	className?: string;
}

export function Box({
	// Common layout
	p, px, py, bg, rounded, shadow, border, hoverEffect,
	// Box layout
	m, mx, my, w, h, maxW, minH,
	display, position, top, right, bottom, left, zIndex,
	overflow, flex,
	// Background
	bgGradient, bgImage,
	// Animation
	animate, animateDelay, animateDuration, animateOnScroll,
	// Standard
	children, className,
}: BoxProps) {
	const common = buildCommonLayoutStyle({ p, px, py, bg, rounded, shadow, border, hoverEffect });
	const box = buildBoxLayoutStyle({ m, mx, my, w, h, maxW, minH, display, position, top, right, bottom, left, zIndex, overflow, flex });
	const bgStyle = buildBgStyle({ bgGradient, bgImage });
	const anim = useAnimation({ animate, animateDelay, animateDuration, animateOnScroll });

	return (
		<div
			ref={anim.ref as React.RefObject<HTMLDivElement>}
			className={cn(common.className, box.className, className)}
			style={{ ...common.style, ...box.style, ...bgStyle.style, ...anim.style }}
		>
			{children}
		</div>
	);
}

export const boxMeta: ComponentMeta = {
	type: 'Box',
	label: 'Box',
	description: 'Generic layout container with spacing, sizing, position, visual control, gradient/image backgrounds, and entrance animations',
	category: 'layout',
	propsSchema: z.object({
		p: z.number().optional(),
		px: z.number().optional(),
		py: z.number().optional(),
		m: z.number().optional(),
		mx: z.number().optional(),
		my: z.number().optional(),
		w: z.union([z.string(), z.number()]).optional(),
		h: z.union([z.string(), z.number()]).optional(),
		maxW: z.union([z.string(), z.number()]).optional(),
		minH: z.union([z.string(), z.number()]).optional(),
		display: z.enum(['flex', 'grid', 'block', 'inline-flex', 'none']).optional(),
		position: z.enum(['relative', 'absolute', 'sticky', 'fixed']).optional(),
		top: z.union([z.number(), z.string()]).optional(),
		right: z.union([z.number(), z.string()]).optional(),
		bottom: z.union([z.number(), z.string()]).optional(),
		left: z.union([z.number(), z.string()]).optional(),
		zIndex: z.number().optional(),
		overflow: z.enum(['auto', 'hidden', 'scroll']).optional(),
		flex: z.enum(['1', 'auto', 'none']).optional(),
		bg: z.string().optional(),
		rounded: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).optional(),
		shadow: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
		border: z.boolean().optional(),
	}).merge(bgGradientPropsSchema).merge(bgImagePropsSchema).merge(hoverEffectPropsSchema).merge(animationPropsSchema),
	acceptsChildren: true,
};

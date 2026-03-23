import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { CSSProperties } from 'react';
import { cn } from '../lib/cn.js';
import { MAX_WIDTH_MAP, buildCommonLayoutStyle, hoverEffectPropsSchema } from '../lib/layout-style.js';
import { useAnimation } from '../lib/use-animation.js';
import { animationPropsSchema, type AnimationProps } from '../lib/animation-style.js';

export interface ContainerProps extends AnimationProps {
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
	center?: boolean;
	p?: number;
	px?: number;
	py?: number;
	hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
	children?: ReactNode;
	className?: string;
}

export function Container({
	maxWidth = 'lg',
	center = true,
	p, px, py,
	hoverEffect,
	animate, animateDelay, animateDuration, animateOnScroll,
	children,
	className,
}: ContainerProps) {
	const style: CSSProperties = {};
	style.maxWidth = MAX_WIDTH_MAP[maxWidth] ?? MAX_WIDTH_MAP.lg;
	style.width = '100%';
	if (center) {
		style.marginLeft = 'auto';
		style.marginRight = 'auto';
	}
	if (p != null) style.padding = `${p}px`;
	if (px != null) {
		style.paddingLeft = `${px}px`;
		style.paddingRight = `${px}px`;
	}
	if (py != null) {
		style.paddingTop = `${py}px`;
		style.paddingBottom = `${py}px`;
	}

	const hover = buildCommonLayoutStyle({ hoverEffect });
	const anim = useAnimation({ animate, animateDelay, animateDuration, animateOnScroll });

	return (
		<div
			ref={anim.ref as React.RefObject<HTMLDivElement>}
			className={cn(hover.className, className)}
			style={{ ...style, ...anim.style }}
		>
			{children}
		</div>
	);
}

export const containerMeta: ComponentMeta = {
	type: 'Container',
	label: 'Container',
	description: 'Centered max-width page container with entrance animations',
	category: 'layout',
	propsSchema: z.object({
		maxWidth: z.enum(['sm', 'md', 'lg', 'xl', '2xl', 'full']).optional(),
		center: z.boolean().optional(),
		p: z.number().optional(),
		px: z.number().optional(),
		py: z.number().optional(),
	}).merge(hoverEffectPropsSchema).merge(animationPropsSchema),
	acceptsChildren: true,
};

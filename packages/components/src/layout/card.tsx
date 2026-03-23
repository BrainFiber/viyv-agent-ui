import { z } from 'zod';
import type { ReactNode, CSSProperties } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { buildCommonLayoutStyle, hoverEffectPropsSchema } from '../lib/layout-style.js';
import { useAnimation } from '../lib/use-animation.js';
import { animationPropsSchema, type AnimationProps } from '../lib/animation-style.js';

export interface CardProps extends AnimationProps {
	title?: string;
	description?: string;
	p?: number;
	bg?: string;
	rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
	shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
	border?: boolean;
	hoverEffect?: 'lift' | 'glow' | 'scale' | 'none';
	children?: ReactNode;
	className?: string;
}

export function Card({
	title, description,
	p, bg, rounded, shadow, border, hoverEffect,
	animate, animateDelay, animateDuration, animateOnScroll,
	children, className,
}: CardProps) {
	// Defaults: p-6, rounded-lg, border, bg-surface, shadow-sm
	const hasCustomLayout = p != null || bg != null || rounded != null || shadow != null || border != null || hoverEffect != null;

	let layoutClassName = '';
	let layoutStyle: CSSProperties = {};

	if (hasCustomLayout) {
		const layout = buildCommonLayoutStyle({
			p: p ?? 24,
			bg: bg ?? 'surface',
			rounded: rounded ?? 'xl',
			shadow: shadow ?? 'sm',
			border: border !== false,
			hoverEffect,
		});
		layoutClassName = layout.className;
		layoutStyle = layout.style;
	}

	const anim = useAnimation({ animate, animateDelay, animateDuration, animateOnScroll });

	return (
		<div
			ref={anim.ref as React.RefObject<HTMLDivElement>}
			className={cn(
				!hasCustomLayout && 'rounded-xl border bg-surface p-6 shadow-sm transition-shadow',
				layoutClassName,
				className,
			)}
			style={hasCustomLayout || anim.style ? { ...layoutStyle, ...anim.style } : undefined}
		>
			{title && (
				<div className="mb-4">
					<h3 className="text-lg font-semibold tracking-tight">{title}</h3>
					{description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
				</div>
			)}
			{children && <div className="flex flex-col gap-4">{children}</div>}
		</div>
	);
}

export const cardMeta: ComponentMeta = {
	type: 'Card',
	label: 'Card',
	description: 'Container card with optional title, hover effects, and entrance animations',
	category: 'layout',
	propsSchema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		p: z.number().optional(),
		bg: z.string().optional(),
		rounded: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).optional(),
		shadow: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
		border: z.boolean().optional(),
	}).merge(hoverEffectPropsSchema).merge(animationPropsSchema),
	acceptsChildren: true,
};

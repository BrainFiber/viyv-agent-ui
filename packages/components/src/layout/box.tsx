import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { buildCommonLayoutStyle, buildBoxLayoutStyle } from '../lib/layout-style.js';
import type { CommonLayoutProps, BoxLayoutProps } from '../lib/layout-style.js';

export interface BoxProps extends CommonLayoutProps, BoxLayoutProps {
	children?: ReactNode;
	className?: string;
}

export function Box({
	// Common layout
	p, px, py, bg, rounded, shadow, border,
	// Box layout
	m, mx, my, w, h, maxW, minH,
	display, position, top, right, bottom, left, zIndex,
	overflow, flex,
	// Standard
	children, className,
}: BoxProps) {
	const common = buildCommonLayoutStyle({ p, px, py, bg, rounded, shadow, border });
	const box = buildBoxLayoutStyle({ m, mx, my, w, h, maxW, minH, display, position, top, right, bottom, left, zIndex, overflow, flex });

	return (
		<div
			className={cn(common.className, box.className, className)}
			style={{ ...common.style, ...box.style }}
		>
			{children}
		</div>
	);
}

export const boxMeta: ComponentMeta = {
	type: 'Box',
	label: 'Box',
	description: 'Generic layout container with spacing, sizing, position, and visual control',
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
	}),
	acceptsChildren: true,
};

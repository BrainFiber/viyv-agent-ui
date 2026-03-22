import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { buildCommonLayoutStyle, buildSizingStyle } from '../lib/layout-style.js';
import type { CommonLayoutProps, SizingProps } from '../lib/layout-style.js';

export interface StackProps extends CommonLayoutProps, SizingProps {
	direction?: 'vertical' | 'horizontal';
	gap?: number;
	align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	justify?: 'start' | 'center' | 'end' | 'between' | 'around';
	wrap?: boolean;
	children?: ReactNode;
	className?: string;
}

const alignMap: Record<string, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
	baseline: 'items-baseline',
};

const justifyMap: Record<string, string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
};

export function Stack({
	direction = 'vertical',
	gap = 16,
	align,
	justify,
	wrap,
	// Common layout
	p, px, py, bg, rounded, shadow, border,
	// Sizing
	w, maxW, minH,
	// Standard
	children,
	className,
}: StackProps) {
	const layout = buildCommonLayoutStyle({ p, px, py, bg, rounded, shadow, border });
	const sizing = buildSizingStyle({ w, maxW, minH });

	return (
		<div
			className={cn(
				'flex',
				direction === 'vertical' ? 'flex-col' : 'flex-row',
				align && alignMap[align],
				justify && justifyMap[justify],
				wrap && 'flex-wrap',
				layout.className,
				className,
			)}
			style={{ gap: `${gap}px`, ...layout.style, ...sizing }}
		>
			{children}
		</div>
	);
}

export const stackMeta: ComponentMeta = {
	type: 'Stack',
	label: 'Stack',
	description: 'Vertical or horizontal stack layout',
	category: 'layout',
	propsSchema: z.object({
		direction: z.enum(['vertical', 'horizontal']).default('vertical'),
		gap: z.number().default(16),
		align: z.enum(['start', 'center', 'end', 'stretch', 'baseline']).optional(),
		justify: z.enum(['start', 'center', 'end', 'between', 'around']).optional(),
		wrap: z.boolean().optional(),
		p: z.number().optional(),
		px: z.number().optional(),
		py: z.number().optional(),
		w: z.union([z.string(), z.number()]).optional(),
		maxW: z.union([z.string(), z.number()]).optional(),
		minH: z.union([z.string(), z.number()]).optional(),
		bg: z.string().optional(),
		rounded: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).optional(),
		shadow: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
		border: z.boolean().optional(),
	}),
	acceptsChildren: true,
};

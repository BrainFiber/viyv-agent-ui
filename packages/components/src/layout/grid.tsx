import { z } from 'zod';
import { useId } from 'react';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { buildCommonLayoutStyle } from '../lib/layout-style.js';
import type { CommonLayoutProps } from '../lib/layout-style.js';

export interface GridProps extends CommonLayoutProps {
	columns?: number;
	gap?: number;
	sm?: number;
	md?: number;
	lg?: number;
	children?: ReactNode;
	className?: string;
}

export function Grid({
	columns = 2,
	gap = 16,
	sm,
	md,
	lg,
	// Common layout
	p, px, py, bg, rounded, shadow, border,
	// Standard
	children,
	className,
}: GridProps) {
	const id = useId().replace(/:/g, '');
	const gridId = `grid-${id}`;
	const layout = buildCommonLayoutStyle({ p, px, py, bg, rounded, shadow, border });

	// Generate responsive media queries
	const hasResponsiveProps = sm != null || md != null || lg != null;
	let mediaStyles: string;

	if (hasResponsiveProps) {
		const parts: string[] = [];
		const smCols = sm ?? 1;
		const mdCols = md ?? Math.min(columns, 2);
		const lgCols = lg ?? columns;
		parts.push(`@media(max-width:640px){#${gridId}{grid-template-columns:repeat(${smCols},minmax(0,1fr))!important}}`);
		parts.push(`@media(min-width:641px) and (max-width:1024px){#${gridId}{grid-template-columns:repeat(${mdCols},minmax(0,1fr))!important}}`);
		if (lg != null) {
			parts.push(`@media(min-width:1025px) and (max-width:1280px){#${gridId}{grid-template-columns:repeat(${lgCols},minmax(0,1fr))!important}}`);
		}
		mediaStyles = parts.join('\n');
	} else {
		// Default auto-responsive behavior (backward compat)
		mediaStyles = `
@media(max-width:640px){#${gridId}{grid-template-columns:1fr!important}}
@media(min-width:641px) and (max-width:1024px){#${gridId}{grid-template-columns:repeat(${Math.min(columns, 2)},minmax(0,1fr))!important}}
		`.trim();
	}

	return (
		<>
			<style>{mediaStyles}</style>
			<div
				id={gridId}
				className={cn('grid items-stretch', layout.className, className)}
				style={{
					gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
					gap: `${gap}px`,
					...layout.style,
				}}
			>
				{children}
			</div>
		</>
	);
}

export const gridMeta: ComponentMeta = {
	type: 'Grid',
	label: 'Grid',
	description: 'Grid layout with configurable columns and responsive breakpoints',
	category: 'layout',
	propsSchema: z.object({
		columns: z.number().default(2),
		gap: z.number().default(16),
		sm: z.number().optional(),
		md: z.number().optional(),
		lg: z.number().optional(),
		p: z.number().optional(),
		px: z.number().optional(),
		py: z.number().optional(),
		bg: z.string().optional(),
		rounded: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).optional(),
		shadow: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
		border: z.boolean().optional(),
	}),
	acceptsChildren: true,
};

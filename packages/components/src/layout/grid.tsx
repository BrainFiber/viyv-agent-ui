import { z } from 'zod';
import { useId } from 'react';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface GridProps {
	columns?: number;
	gap?: number;
	children?: ReactNode;
	className?: string;
}

export function Grid({ columns = 2, gap = 16, children, className }: GridProps) {
	const id = useId().replace(/:/g, '');
	const gridId = `grid-${id}`;
	return (
		<>
			<style>{`
@media(max-width:640px){#${gridId}{grid-template-columns:1fr!important}}
@media(min-width:641px) and (max-width:1024px){#${gridId}{grid-template-columns:repeat(${Math.min(columns, 2)},minmax(0,1fr))!important}}
			`}</style>
			<div
				id={gridId}
				className={cn('grid', className)}
				style={{
					gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
					gap: `${gap}px`,
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
	description: 'Grid layout with configurable columns',
	category: 'layout',
	propsSchema: z.object({
		columns: z.number().default(2),
		gap: z.number().default(16),
	}),
	acceptsChildren: true,
};

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface DividerProps {
	spacing?: number;
	variant?: 'solid' | 'dashed';
	className?: string;
}

export function Divider({ spacing, variant, className }: DividerProps) {
	return (
		<hr
			className={cn('border-border', variant === 'dashed' && 'border-dashed', className)}
			style={spacing != null ? { marginTop: `${spacing}px`, marginBottom: `${spacing}px` } : undefined}
		/>
	);
}

export const dividerMeta: ComponentMeta = {
	type: 'Divider',
	label: 'Divider',
	description: 'Visual section separator',
	category: 'display',
	propsSchema: z.object({
		spacing: z.number().optional(),
		variant: z.enum(['solid', 'dashed']).optional(),
	}),
	acceptsChildren: false,
};

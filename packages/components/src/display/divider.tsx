import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface DividerProps {
	className?: string;
}

export function Divider({ className }: DividerProps) {
	return <hr className={cn('border-border', className)} />;
}

export const dividerMeta: ComponentMeta = {
	type: 'Divider',
	label: 'Divider',
	description: 'Visual section separator',
	category: 'display',
	propsSchema: z.object({}),
	acceptsChildren: false,
};

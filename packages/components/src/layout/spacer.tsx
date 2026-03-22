import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface SpacerProps {
	size?: number | 'auto';
	className?: string;
}

export function Spacer({ size = 'auto', className }: SpacerProps) {
	if (size === 'auto') {
		return <div className={cn('flex-1', className)} />;
	}
	return <div className={className} style={{ flexBasis: `${size}px`, flexShrink: 0 }} />;
}

export const spacerMeta: ComponentMeta = {
	type: 'Spacer',
	label: 'Spacer',
	description: 'Flexible space filler for flex layouts',
	category: 'layout',
	propsSchema: z.object({
		size: z.union([z.number(), z.literal('auto')]).optional(),
	}),
	acceptsChildren: false,
};

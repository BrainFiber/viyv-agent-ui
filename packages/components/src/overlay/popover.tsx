import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as P from '../ui/popover.js';
import { cn } from '../lib/cn.js';

export interface PopoverProps {
	trigger?: string;
	side?: 'top' | 'bottom' | 'left' | 'right';
	children?: ReactNode;
	className?: string;
}

export function Popover({ trigger = 'Open', side = 'bottom', children, className }: PopoverProps) {
	return (
		<P.Root>
			<P.Trigger asChild>
				<button
					type="button"
					className="inline-flex items-center justify-center rounded-lg border bg-surface px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted"
				>
					{trigger}
				</button>
			</P.Trigger>
			<P.Content side={side} className={cn('p-4', className)}>
				{children}
			</P.Content>
		</P.Root>
	);
}

export const popoverMeta: ComponentMeta = {
	type: 'Popover',
	label: 'Popover',
	description: 'Floating content panel triggered by a button',
	category: 'layout',
	propsSchema: z.object({
		trigger: z.string().optional(),
		side: z.enum(['top', 'bottom', 'left', 'right']).optional(),
	}),
	acceptsChildren: true,
};

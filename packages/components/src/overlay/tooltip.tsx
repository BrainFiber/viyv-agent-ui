import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { Children } from 'react';
import type { ReactNode } from 'react';
import * as T from '../ui/tooltip.js';
import { cn } from '../lib/cn.js';

export interface TooltipProps {
	content: string;
	position?: 'top' | 'bottom' | 'left' | 'right';
	children?: ReactNode;
	className?: string;
}

export function Tooltip({ content, position = 'top', children, className }: TooltipProps) {
	const firstChild = Children.toArray(children)[0] ?? null;
	return (
		<T.Provider>
			<T.Root>
				<T.Trigger asChild>
					<span className={cn('inline-block', className)}>{firstChild}</span>
				</T.Trigger>
				<T.Portal>
					<T.Content side={position}>{content}</T.Content>
				</T.Portal>
			</T.Root>
		</T.Provider>
	);
}

export const tooltipMeta: ComponentMeta = {
	type: 'Tooltip',
	label: 'Tooltip',
	description: 'Hover hint popup',
	category: 'display',
	propsSchema: z.object({
		content: z.string(),
		position: z.enum(['top', 'bottom', 'left', 'right']).optional(),
	}),
	acceptsChildren: true,
};

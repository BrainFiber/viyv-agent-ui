import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import * as ScrollAreaUI from '../ui/scroll-area.js';

export interface ScrollAreaProps {
	maxHeight?: number;
	orientation?: 'vertical' | 'horizontal' | 'both';
	children?: ReactNode;
	className?: string;
}

export function ScrollArea({ maxHeight, orientation = 'vertical', children, className }: ScrollAreaProps) {
	return (
		<ScrollAreaUI.Root
			className={cn('rounded-lg', className)}
			style={maxHeight ? { maxHeight } : undefined}
		>
			<div
				className={cn(
					orientation === 'horizontal' && 'flex',
				)}
			>
				{children}
			</div>
			{(orientation === 'vertical' || orientation === 'both') && (
				<ScrollAreaUI.ScrollBar orientation="vertical" />
			)}
			{(orientation === 'horizontal' || orientation === 'both') && (
				<ScrollAreaUI.ScrollBar orientation="horizontal" />
			)}
		</ScrollAreaUI.Root>
	);
}

export const scrollAreaMeta: ComponentMeta = {
	type: 'ScrollArea',
	label: 'Scroll Area',
	description: 'Custom scrollable container with styled scrollbars',
	category: 'layout',
	propsSchema: z.object({
		maxHeight: z.number().optional(),
		orientation: z.enum(['vertical', 'horizontal', 'both']).default('vertical'),
	}),
	acceptsChildren: true,
};

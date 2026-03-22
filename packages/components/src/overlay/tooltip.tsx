import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useId, Children } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface TooltipProps {
	content: string;
	position?: 'top' | 'bottom' | 'left' | 'right';
	children?: ReactNode;
	className?: string;
}

const positionStyles: Record<string, string> = {
	top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
	bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
	left: 'right-full top-1/2 -translate-y-1/2 mr-2',
	right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, position = 'top', children, className }: TooltipProps) {
	const [visible, setVisible] = useState(false);
	const tooltipId = useId();
	const firstChild = Children.toArray(children)[0] ?? null;

	return (
		<span
			className={cn('relative inline-block', className)}
			onMouseEnter={() => setVisible(true)}
			onMouseLeave={() => setVisible(false)}
			onFocus={() => setVisible(true)}
			onBlur={() => setVisible(false)}
		>
			<span aria-describedby={visible ? tooltipId : undefined}>
				{firstChild}
			</span>
			{visible && (
				<span
					id={tooltipId}
					role="tooltip"
					className={cn(
						'absolute z-50 whitespace-nowrap rounded bg-tooltip-bg px-2 py-1 text-xs text-tooltip-fg shadow-lg',
						positionStyles[position] ?? positionStyles.top,
					)}
				>
					{content}
				</span>
			)}
		</span>
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

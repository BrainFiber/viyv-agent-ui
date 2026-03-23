import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface ButtonGroupProps {
	children?: ReactNode;
	className?: string;
}

export function ButtonGroup({ children, className }: ButtonGroupProps) {
	return (
		<div
			role="group"
			className={cn(
				'inline-flex [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none [&>*:not(:first-child)]:border-l-0',
				className,
			)}
		>
			{children}
		</div>
	);
}

export const buttonGroupMeta: ComponentMeta = {
	type: 'ButtonGroup',
	label: 'Button Group',
	description: 'Group of buttons with joined borders',
	category: 'input',
	propsSchema: z.object({}),
	acceptsChildren: true,
};

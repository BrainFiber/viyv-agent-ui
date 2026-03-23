import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface InputGroupProps {
	prefix?: string;
	suffix?: string;
	children?: ReactNode;
	className?: string;
}

export function InputGroup({ prefix, suffix, children, className }: InputGroupProps) {
	return (
		<div
			className={cn(
				'flex items-center rounded-lg border border-border-strong bg-surface text-sm shadow-sm',
				'focus-within:ring-2 focus-within:ring-ring/30',
				className,
			)}
		>
			{prefix && (
				<span className="flex items-center border-r border-border-strong bg-muted px-3 py-2 text-fg-secondary">
					{prefix}
				</span>
			)}
			<div className="flex flex-1 items-center [&>input]:border-0 [&>input]:shadow-none [&>input]:ring-0 [&>input]:focus:ring-0">
				{children}
			</div>
			{suffix && (
				<span className="flex items-center border-l border-border-strong bg-muted px-3 py-2 text-fg-secondary">
					{suffix}
				</span>
			)}
		</div>
	);
}

export const inputGroupMeta: ComponentMeta = {
	type: 'InputGroup',
	label: 'Input Group',
	description: 'Input wrapper with prefix and suffix addons',
	category: 'input',
	propsSchema: z.object({
		prefix: z.string().optional(),
		suffix: z.string().optional(),
	}),
	acceptsChildren: true,
};

import { z } from 'zod';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { ChevronDown } from '../lib/icons.js';
import * as CollapsibleUI from '../ui/collapsible.js';

export interface CollapsibleProps {
	title: string;
	defaultOpen?: boolean;
	children?: ReactNode;
	className?: string;
}

export function Collapsible({ title, defaultOpen = false, children, className }: CollapsibleProps) {
	const [open, setOpen] = useState(defaultOpen);

	return (
		<CollapsibleUI.Root open={open} onOpenChange={setOpen} className={cn('rounded-lg border', className)}>
			<CollapsibleUI.Trigger asChild>
				<button
					type="button"
					className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-fg hover:bg-muted transition-colors"
				>
					{title}
					<ChevronDown
						aria-hidden="true"
						className={cn(
							'h-4 w-4 shrink-0 text-fg-muted transition-transform duration-200',
							open && 'rotate-180',
						)}
					/>
				</button>
			</CollapsibleUI.Trigger>
			<CollapsibleUI.Content>
				<div className="px-4 pb-3 text-sm text-fg-secondary">
					{children}
				</div>
			</CollapsibleUI.Content>
		</CollapsibleUI.Root>
	);
}

export const collapsibleMeta: ComponentMeta = {
	type: 'Collapsible',
	label: 'Collapsible',
	description: 'Single collapsible panel with a trigger button',
	category: 'layout',
	propsSchema: z.object({
		title: z.string(),
		defaultOpen: z.boolean().optional(),
	}),
	acceptsChildren: true,
};

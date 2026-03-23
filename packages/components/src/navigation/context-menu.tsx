import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as CM from '../ui/context-menu.js';
import { cn } from '../lib/cn.js';

export interface ContextMenuItem {
	label: string;
	value?: string;
	icon?: string;
	disabled?: boolean;
	separator?: boolean;
}

export interface ContextMenuProps {
	items: ContextMenuItem[];
	onSelect?: (value: string) => void;
	children?: ReactNode;
	className?: string;
}

export function ContextMenu({ items, onSelect, children, className }: ContextMenuProps) {
	return (
		<CM.Root>
			<CM.Trigger asChild>
				<div
					className={cn(
						'flex min-h-[6rem] items-center justify-center rounded-lg border border-dashed p-4 text-sm text-fg-muted',
						className,
					)}
				>
					{children ?? 'Right-click here'}
				</div>
			</CM.Trigger>
			<CM.Content>
				{items.map((item, i) =>
					item.separator ? (
						<CM.Separator key={`sep-${i}`} />
					) : (
						<CM.Item
							key={item.value ?? item.label}
							disabled={item.disabled}
							onSelect={() => onSelect?.(item.value ?? item.label)}
							aria-label={item.label}
						>
							{item.icon && <span className="mr-2">{item.icon}</span>}
							{item.label}
						</CM.Item>
					),
				)}
			</CM.Content>
		</CM.Root>
	);
}

export const contextMenuMeta: ComponentMeta = {
	type: 'ContextMenu',
	label: 'Context Menu',
	description: 'Right-click context menu',
	category: 'navigation',
	propsSchema: z.object({
		items: z.array(
			z.object({
				label: z.string(),
				value: z.string().optional(),
				icon: z.string().optional(),
				disabled: z.boolean().optional(),
				separator: z.boolean().optional(),
			}),
		),
	}),
	acceptsChildren: true,
};

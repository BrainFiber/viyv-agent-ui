import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface SidebarProps {
	collapsed?: boolean;
	width?: number;
	collapsedWidth?: number;
	position?: 'left' | 'right';
	children?: ReactNode;
	className?: string;
}

export function Sidebar({
	collapsed = false,
	width = 256,
	collapsedWidth = 64,
	position = 'left',
	children,
	className,
}: SidebarProps) {
	const currentWidth = collapsed ? collapsedWidth : width;

	return (
		<aside
			aria-label="Sidebar"
			data-collapsed={collapsed || undefined}
			className={cn(
				'flex h-full flex-col overflow-hidden border-border-strong bg-surface transition-[width] duration-200',
				position === 'left' ? 'border-r' : 'border-l',
				className,
			)}
			style={{ width: currentWidth, minWidth: currentWidth }}
		>
			<div
				className={cn(
					'flex flex-1 flex-col overflow-y-auto overflow-x-hidden',
					collapsed ? 'items-center px-2 py-4' : 'px-4 py-4',
				)}
			>
				{children}
			</div>
		</aside>
	);
}

export const sidebarMeta: ComponentMeta = {
	type: 'Sidebar',
	label: 'Sidebar',
	description: 'Collapsible sidebar panel for navigation or tools',
	category: 'layout',
	propsSchema: z.object({
		collapsed: z.boolean().optional(),
		width: z.number().default(256),
		collapsedWidth: z.number().default(64),
		position: z.enum(['left', 'right']).default('left'),
	}),
	acceptsChildren: true,
};

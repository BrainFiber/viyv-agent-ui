import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState } from 'react';
import { cn } from '../lib/cn.js';

export interface MenuItem {
	label: string;
	href?: string;
	icon?: string;
	active?: boolean;
	items?: MenuItem[];
}

export interface MenuProps {
	items: MenuItem[];
	direction?: 'vertical' | 'horizontal';
	collapsed?: boolean;
	className?: string;
}

function MenuItemComponent({ item, collapsed }: { item: MenuItem; collapsed?: boolean }) {
	const [open, setOpen] = useState(false);
	const hasChildren = item.items && item.items.length > 0;

	const content = (
		<>
			{item.icon && <span className="shrink-0">{item.icon}</span>}
			{!collapsed && <span className="truncate">{item.label}</span>}
			{hasChildren && !collapsed && (
				<span className={cn('ml-auto transition-transform', open && 'rotate-180')}>&#x25BE;</span>
			)}
		</>
	);

	const baseClass = cn(
		'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
		item.active
			? 'bg-primary-soft font-medium text-primary-soft-fg'
			: 'text-fg-secondary hover:bg-muted',
	);

	return (
		<li aria-label={item.label}>
			{item.href && !hasChildren ? (
				<a href={item.href} className={baseClass} aria-current={item.active ? 'page' : undefined}>
					{content}
				</a>
			) : (
				<button
					type="button"
					className={baseClass}
					onClick={() => hasChildren && setOpen(!open)}
					aria-expanded={hasChildren ? open : undefined}
					aria-current={item.active ? 'page' : undefined}
				>
					{content}
				</button>
			)}
			{hasChildren && open && !collapsed && (
				<ul className="ml-4 mt-1 space-y-1">
					{item.items!.map((child) => (
						<MenuItemComponent key={child.label} item={child} />
					))}
				</ul>
			)}
		</li>
	);
}

export function Menu({ items, direction = 'vertical', collapsed, className }: MenuProps) {
	return (
		<nav role="navigation" className={cn(className)}>
			<ul className={cn(
				'space-y-1',
				direction === 'horizontal' && 'flex items-center space-y-0 gap-1',
			)}>
				{items.map((item) => (
					<MenuItemComponent key={item.label} item={item} collapsed={collapsed} />
				))}
			</ul>
		</nav>
	);
}

export const menuMeta: ComponentMeta = {
	type: 'Menu',
	label: 'Menu',
	description: 'Navigation menu with nested items',
	category: 'navigation',
	propsSchema: z.object({
		items: z.array(z.object({
			label: z.string(),
			href: z.string().optional(),
			icon: z.string().optional(),
			active: z.boolean().optional(),
			items: z.array(z.object({
				label: z.string(),
				href: z.string().optional(),
				icon: z.string().optional(),
				active: z.boolean().optional(),
			})).optional(),
		})),
		direction: z.enum(['vertical', 'horizontal']).optional(),
		collapsed: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useRef, useCallback, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
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

/**
 * Collect refs of all visible interactive elements (menuitem buttons/links)
 * in DOM order from a container.
 */
function getVisibleMenuItems(container: HTMLElement): HTMLElement[] {
	return Array.from(container.querySelectorAll<HTMLElement>('[role="menuitem"]'));
}

function MenuItemComponent({
	item,
	collapsed,
	focusedIndex,
	itemIndex,
	onRequestFocus,
}: {
	item: MenuItem;
	collapsed?: boolean;
	focusedIndex: number;
	itemIndex: number;
	onRequestFocus: (index: number) => void;
}) {
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
		'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
		item.active
			? 'bg-primary-soft font-medium text-primary-soft-fg'
			: 'text-fg-secondary hover:bg-muted',
	);

	const isFocused = focusedIndex === itemIndex;

	return (
		<li aria-label={item.label}>
			{item.href && !hasChildren ? (
				<a
					href={item.href}
					role="menuitem"
					tabIndex={isFocused ? 0 : -1}
					className={baseClass}
					aria-current={item.active ? 'page' : undefined}
					onFocus={() => onRequestFocus(itemIndex)}
				>
					{content}
				</a>
			) : (
				<button
					type="button"
					role="menuitem"
					tabIndex={isFocused ? 0 : -1}
					className={baseClass}
					onClick={() => hasChildren && setOpen(!open)}
					aria-expanded={hasChildren ? open : undefined}
					aria-current={item.active ? 'page' : undefined}
					onFocus={() => onRequestFocus(itemIndex)}
				>
					{content}
				</button>
			)}
			{hasChildren && open && !collapsed && (
				<ul role="menu" className="ml-4 mt-1 space-y-1">
					{item.items!.map((child) => (
						<MenuItemComponent
							key={child.label}
							item={child}
							focusedIndex={-1}
							itemIndex={-1}
							onRequestFocus={() => {}}
						/>
					))}
				</ul>
			)}
		</li>
	);
}

export function Menu({ items, direction = 'vertical', collapsed, className }: MenuProps) {
	const menuRef = useRef<HTMLUListElement>(null);
	const [focusedIndex, setFocusedIndex] = useState(0);

	/**
	 * After focusedIndex changes, move DOM focus to the corresponding element.
	 */
	useEffect(() => {
		if (!menuRef.current) return;
		const allItems = getVisibleMenuItems(menuRef.current);
		allItems[focusedIndex]?.focus();
	}, [focusedIndex]);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (!menuRef.current) return;

			const allItems = getVisibleMenuItems(menuRef.current);
			const count = allItems.length;
			if (count === 0) return;

			const current = allItems[focusedIndex];

			switch (e.key) {
				case 'ArrowDown': {
					e.preventDefault();
					setFocusedIndex((prev) => (prev + 1) % count);
					break;
				}
				case 'ArrowUp': {
					e.preventDefault();
					setFocusedIndex((prev) => (prev - 1 + count) % count);
					break;
				}
				case 'Home': {
					e.preventDefault();
					setFocusedIndex(0);
					break;
				}
				case 'End': {
					e.preventDefault();
					setFocusedIndex(count - 1);
					break;
				}
				case 'Enter':
				case ' ': {
					e.preventDefault();
					current?.click();
					// After click (which may open submenu), re-query items on next render
					break;
				}
				case 'ArrowRight': {
					// Expand submenu if current item has aria-expanded="false"
					if (current?.getAttribute('aria-expanded') === 'false') {
						e.preventDefault();
						current.click();
					}
					break;
				}
				case 'ArrowLeft': {
					// Collapse submenu if current item has aria-expanded="true"
					if (current?.getAttribute('aria-expanded') === 'true') {
						e.preventDefault();
						current.click();
					}
					break;
				}
			}
		},
		[focusedIndex],
	);

	return (
		<nav role="navigation" className={cn(className)}>
			<ul
				ref={menuRef}
				role="menu"
				onKeyDown={handleKeyDown}
				className={cn(
					'space-y-1',
					direction === 'horizontal' && 'flex items-center space-y-0 gap-1',
				)}
			>
				{items.map((item, i) => (
					<MenuItemComponent
						key={item.label}
						item={item}
						collapsed={collapsed}
						focusedIndex={focusedIndex}
						itemIndex={i}
						onRequestFocus={setFocusedIndex}
					/>
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

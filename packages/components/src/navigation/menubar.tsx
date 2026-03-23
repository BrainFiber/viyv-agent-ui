import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as MB from '../ui/menubar.js';
import { cn } from '../lib/cn.js';

export interface MenubarItem {
	label: string;
	shortcut?: string;
	disabled?: boolean;
	separator?: boolean;
}

export interface MenubarMenu {
	label: string;
	items: MenubarItem[];
}

export interface MenubarProps {
	menus: MenubarMenu[];
	onSelect?: (menuLabel: string, itemLabel: string) => void;
	className?: string;
}

export function Menubar({ menus, onSelect, className }: MenubarProps) {
	return (
		<MB.Root className={cn(className)}>
			{menus.map((menu) => (
				<MB.Menu key={menu.label}>
					<MB.Trigger>{menu.label}</MB.Trigger>
					<MB.Content>
						{menu.items.map((item, i) =>
							item.separator ? (
								<MB.Separator key={`sep-${i}`} />
							) : (
								<MB.Item
									key={item.label}
									disabled={item.disabled}
									onSelect={() => onSelect?.(menu.label, item.label)}
									aria-label={item.label}
								>
									{item.label}
									{item.shortcut && (
										<span className="ml-auto text-xs tracking-widest text-fg-muted">
											{item.shortcut}
										</span>
									)}
								</MB.Item>
							),
						)}
					</MB.Content>
				</MB.Menu>
			))}
		</MB.Root>
	);
}

export const menubarMeta: ComponentMeta = {
	type: 'Menubar',
	label: 'Menubar',
	description: 'Horizontal menu bar with dropdown menus',
	category: 'navigation',
	propsSchema: z.object({
		menus: z.array(
			z.object({
				label: z.string(),
				items: z.array(
					z.object({
						label: z.string(),
						shortcut: z.string().optional(),
						disabled: z.boolean().optional(),
						separator: z.boolean().optional(),
					}),
				),
			}),
		),
	}),
	acceptsChildren: false,
};

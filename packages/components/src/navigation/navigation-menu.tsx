import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as NM from '../ui/navigation-menu.js';
import { cn } from '../lib/cn.js';

export interface NavigationMenuSubItem {
	label: string;
	href?: string;
	description?: string;
}

export interface NavigationMenuItem {
	label: string;
	href?: string;
	items?: NavigationMenuSubItem[];
}

export interface NavigationMenuProps {
	items: NavigationMenuItem[];
	className?: string;
}

export function NavigationMenu({ items, className }: NavigationMenuProps) {
	return (
		<NM.Root className={cn(className)}>
			<NM.List>
				{items.map((item) => (
					<NM.Item key={item.label}>
						{item.items && item.items.length > 0 ? (
							<>
								<NM.Trigger>{item.label}</NM.Trigger>
								<NM.Content>
									<ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
										{item.items.map((sub) => (
											<li key={sub.label}>
												<NM.Link
													href={sub.href ?? '#'}
													className={cn(
														'block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors',
														'hover:bg-muted focus:bg-muted',
													)}
												>
													<div className="text-sm font-medium leading-none">{sub.label}</div>
													{sub.description && (
														<p className="mt-1.5 line-clamp-2 text-sm leading-snug text-fg-muted">
															{sub.description}
														</p>
													)}
												</NM.Link>
											</li>
										))}
									</ul>
								</NM.Content>
							</>
						) : (
							<NM.Link
								href={item.href ?? '#'}
								className={cn(
									'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
									'hover:bg-muted hover:text-fg focus:bg-muted focus:text-fg focus:outline-none',
								)}
							>
								{item.label}
							</NM.Link>
						)}
					</NM.Item>
				))}
			</NM.List>
		</NM.Root>
	);
}

export const navigationMenuMeta: ComponentMeta = {
	type: 'NavigationMenu',
	label: 'Navigation Menu',
	description: 'Horizontal navigation menu with dropdown sub-menus',
	category: 'navigation',
	propsSchema: z.object({
		items: z.array(
			z.object({
				label: z.string(),
				href: z.string().optional(),
				items: z
					.array(
						z.object({
							label: z.string(),
							href: z.string().optional(),
							description: z.string().optional(),
						}),
					)
					.optional(),
			}),
		),
	}),
	acceptsChildren: false,
};

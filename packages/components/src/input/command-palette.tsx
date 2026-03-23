import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as D from '../ui/dialog.js';
import * as C from '../ui/command.js';
import { cn } from '../lib/cn.js';
import { Search } from '../lib/icons.js';

export interface CommandPaletteItem {
	label: string;
	value?: string;
	icon?: string;
}

export interface CommandPaletteGroup {
	heading?: string;
	items: CommandPaletteItem[];
}

export interface CommandPaletteProps {
	open?: boolean;
	placeholder?: string;
	groups?: CommandPaletteGroup[];
	onSelect?: (value: string) => void;
	className?: string;
}

export function CommandPalette({
	open = true,
	placeholder = 'Type a command or search...',
	groups = [],
	onSelect,
	className,
}: CommandPaletteProps) {
	return (
		<D.Root open={open}>
			<D.Portal>
				<D.Overlay />
				<D.Content
					className={cn('max-w-lg overflow-hidden p-0', className)}
					aria-describedby={undefined}
				>
					<D.Title className="sr-only">Command Palette</D.Title>
					<C.Root className="flex h-full w-full flex-col">
						<div className="flex items-center border-b px-3">
							<Search aria-hidden="true" className="mr-2 h-4 w-4 shrink-0 text-fg-muted" />
							<C.Input
								placeholder={placeholder}
								className="border-0 shadow-none focus:ring-0"
							/>
						</div>
						<C.List>
							<C.Empty>No results found.</C.Empty>
							{groups.map((group, gi) => (
								<C.Group
									key={group.heading ?? `group-${gi}`}
									heading={group.heading}
									className="px-1 py-1.5 text-xs font-semibold text-fg-muted [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-fg-muted"
								>
									{group.items.map((item) => (
										<C.Item
											key={item.value ?? item.label}
											value={item.value ?? item.label}
											onSelect={() => onSelect?.(item.value ?? item.label)}
											aria-label={item.label}
										>
											{item.icon && <span className="mr-2">{item.icon}</span>}
											{item.label}
										</C.Item>
									))}
								</C.Group>
							))}
						</C.List>
					</C.Root>
				</D.Content>
			</D.Portal>
		</D.Root>
	);
}

export const commandPaletteMeta: ComponentMeta = {
	type: 'CommandPalette',
	label: 'Command Palette',
	description: 'Searchable command palette dialog',
	category: 'navigation',
	propsSchema: z.object({
		placeholder: z.string().optional(),
		groups: z
			.array(
				z.object({
					heading: z.string().optional(),
					items: z.array(
						z.object({
							label: z.string(),
							value: z.string().optional(),
							icon: z.string().optional(),
						}),
					),
				}),
			)
			.optional(),
	}),
	acceptsChildren: false,
	overlay: true,
};

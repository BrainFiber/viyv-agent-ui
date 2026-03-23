import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as DM from '../ui/dropdown-menu.js';
import { cn } from '../lib/cn.js';
import { ChevronDown } from '../lib/icons.js';

export interface DropdownMenuItem {
	label: string;
	value?: string;
	icon?: string;
	disabled?: boolean;
	separator?: boolean;
}

export interface DropdownMenuProps {
	items: DropdownMenuItem[];
	trigger?: string;
	onSelect?: (value: string) => void;
	className?: string;
}

export function DropdownMenu({
	items,
	trigger = 'Open menu',
	onSelect,
	className,
}: DropdownMenuProps) {
	return (
		<DM.Root>
			<DM.Trigger asChild>
				<button
					type="button"
					className={cn(
						'inline-flex items-center justify-center gap-1 rounded-lg border bg-surface px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted',
						className,
					)}
				>
					{trigger}
					<ChevronDown aria-hidden="true" className="h-4 w-4" />
				</button>
			</DM.Trigger>
			<DM.Content>
				{items.map((item, i) =>
					item.separator ? (
						<DM.Separator key={`sep-${i}`} />
					) : (
						<DM.Item
							key={item.value ?? item.label}
							disabled={item.disabled}
							onSelect={() => onSelect?.(item.value ?? item.label)}
							aria-label={item.label}
						>
							{item.icon && <span className="mr-2">{item.icon}</span>}
							{item.label}
						</DM.Item>
					),
				)}
			</DM.Content>
		</DM.Root>
	);
}

export const dropdownMenuMeta: ComponentMeta = {
	type: 'DropdownMenu',
	label: 'Dropdown Menu',
	description: 'Menu triggered by a button click',
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
		trigger: z.string().optional(),
	}),
	acceptsChildren: false,
};

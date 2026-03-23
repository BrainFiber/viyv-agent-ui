import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';
import * as ToggleGroupUI from '../ui/toggle-group.js';

const toggleGroupItemVariants = cva('', {
	variants: {
		variant: {
			default: '',
			outline:
				'border border-border-strong bg-transparent shadow-sm hover:bg-muted hover:text-fg',
		},
		size: {
			sm: 'h-8 px-2 text-xs',
			md: 'h-10 px-3 text-sm',
			lg: 'h-12 px-4 text-base',
		},
	},
	defaultVariants: { variant: 'default', size: 'md' },
});

export interface ToggleGroupProps extends VariantProps<typeof toggleGroupItemVariants> {
	items: Array<{ value: string; label: string }>;
	type?: 'single' | 'multiple';
	value?: string | string[];
	variant?: 'default' | 'outline';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	onChange?: (value: string | string[]) => void;
	className?: string;
}

export function ToggleGroup({
	items,
	type = 'single',
	value,
	variant,
	size,
	disabled,
	onChange,
	className,
}: ToggleGroupProps) {
	if (type === 'multiple') {
		const arrValue = Array.isArray(value) ? value : value ? [value] : [];
		return (
			<ToggleGroupUI.Root
				type="multiple"
				value={arrValue}
				disabled={disabled}
				onValueChange={(v) => onChange?.(v)}
				className={className}
			>
				{items.map((item) => (
					<ToggleGroupUI.Item
						key={item.value}
						value={item.value}
						aria-label={item.label}
						className={cn(toggleGroupItemVariants({ variant, size }))}
					>
						{item.label}
					</ToggleGroupUI.Item>
				))}
			</ToggleGroupUI.Root>
		);
	}

	const strValue = Array.isArray(value) ? value[0] ?? '' : value ?? '';
	return (
		<ToggleGroupUI.Root
			type="single"
			value={strValue}
			disabled={disabled}
			onValueChange={(v) => onChange?.(v)}
			className={className}
		>
			{items.map((item) => (
				<ToggleGroupUI.Item
					key={item.value}
					value={item.value}
					aria-label={item.label}
					className={cn(toggleGroupItemVariants({ variant, size }))}
				>
					{item.label}
				</ToggleGroupUI.Item>
			))}
		</ToggleGroupUI.Root>
	);
}

export const toggleGroupMeta: ComponentMeta = {
	type: 'ToggleGroup',
	label: 'Toggle Group',
	description: 'A group of toggle buttons for single or multiple selection',
	category: 'input',
	propsSchema: z.object({
		items: z.array(z.object({ value: z.string(), label: z.string() })),
		type: z.enum(['single', 'multiple']).default('single'),
		value: z.union([z.string(), z.array(z.string())]).optional(),
		variant: z.enum(['default', 'outline']).default('default'),
		size: z.enum(['sm', 'md', 'lg']).default('md'),
		disabled: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

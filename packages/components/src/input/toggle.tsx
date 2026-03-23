import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';
import * as ToggleUI from '../ui/toggle.js';

const toggleVariants = cva('', {
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

export interface ToggleProps extends VariantProps<typeof toggleVariants> {
	label?: string;
	pressed?: boolean;
	variant?: 'default' | 'outline';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	onChange?: (pressed: boolean) => void;
	className?: string;
}

export function Toggle({
	label,
	pressed,
	variant,
	size,
	disabled,
	onChange,
	className,
}: ToggleProps) {
	return (
		<ToggleUI.Root
			pressed={pressed}
			disabled={disabled}
			aria-label={label ?? 'Toggle'}
			onPressedChange={(v) => onChange?.(v)}
			className={cn(toggleVariants({ variant, size }), className)}
		>
			{label}
		</ToggleUI.Root>
	);
}

export const toggleMeta: ComponentMeta = {
	type: 'Toggle',
	label: 'Toggle',
	description: 'A two-state toggle button',
	category: 'input',
	propsSchema: z.object({
		label: z.string().optional(),
		pressed: z.boolean().optional(),
		variant: z.enum(['default', 'outline']).default('default'),
		size: z.enum(['sm', 'md', 'lg']).default('md'),
		disabled: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

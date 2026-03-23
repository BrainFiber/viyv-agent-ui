import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';
import { Loader2 } from '../lib/icons.js';

const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-lg font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
	{
		variants: {
			variant: {
				primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
				secondary: 'border border-border-strong bg-surface text-fg-secondary hover:bg-muted hover:text-fg',
				danger: 'bg-danger text-danger-fg hover:bg-danger-hover',
				ghost: 'text-fg-secondary shadow-none hover:bg-muted hover:text-fg hover:shadow-none',
				outline: 'border border-primary text-primary shadow-none hover:bg-primary-soft',
			},
			size: {
				sm: 'h-8 px-3 text-xs',
				md: 'h-10 px-4 text-sm',
				lg: 'h-12 px-6 text-base',
			},
		},
		defaultVariants: { variant: 'primary', size: 'md' },
	},
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
	label: string;
	disabled?: boolean;
	loading?: boolean;
	onClick?: () => void;
	children?: ReactNode;
	className?: string;
}

export function Button({ label, variant, size, disabled, loading, onClick, className }: ButtonProps) {
	const isDisabled = disabled || loading;
	return (
		<button
			type="button"
			disabled={isDisabled}
			aria-busy={loading || undefined}
			className={cn(
				buttonVariants({ variant, size }),
				isDisabled && 'cursor-not-allowed opacity-50',
				className,
			)}
			onClick={onClick}
		>
			{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
			{label}
		</button>
	);
}

export { buttonVariants };

export const buttonMeta: ComponentMeta = {
	type: 'Button',
	label: 'Button',
	description: 'Clickable button',
	category: 'input',
	propsSchema: z.object({
		label: z.string(),
		variant: z.enum(['primary', 'secondary', 'danger', 'ghost', 'outline']).default('primary'),
		size: z.enum(['sm', 'md', 'lg']).default('md'),
		loading: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

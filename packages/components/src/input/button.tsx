import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { Loader2 } from '../lib/icons.js';

export interface ButtonProps {
	label: string;
	variant?: 'primary' | 'secondary' | 'danger';
	disabled?: boolean;
	loading?: boolean;
	onClick?: () => void;
	children?: ReactNode;
	className?: string;
}

const variantStyles = {
	primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
	secondary: 'border border-border-strong bg-surface text-fg-secondary hover:bg-muted hover:text-fg',
	danger: 'bg-danger text-danger-fg hover:bg-danger-hover',
};

export function Button({ label, variant = 'primary', disabled, loading, onClick, className }: ButtonProps) {
	const isDisabled = disabled || loading;
	return (
		<button
			type="button"
			disabled={isDisabled}
			aria-busy={loading || undefined}
			className={cn(
				'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
				variantStyles[variant],
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

export const buttonMeta: ComponentMeta = {
	type: 'Button',
	label: 'Button',
	description: 'Clickable button',
	category: 'input',
	propsSchema: z.object({
		label: z.string(),
		variant: z.enum(['primary', 'secondary', 'danger']).default('primary'),
		loading: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

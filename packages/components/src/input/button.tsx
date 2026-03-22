import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface ButtonProps {
	label: string;
	variant?: 'primary' | 'secondary' | 'danger';
	disabled?: boolean;
	onClick?: () => void;
	children?: ReactNode;
	className?: string;
}

const variantStyles = {
	primary: 'bg-primary text-primary-fg hover:bg-primary-hover',
	secondary: 'bg-muted text-fg-secondary hover:bg-muted-strong border',
	danger: 'bg-danger text-danger-fg hover:bg-danger-hover',
};

export function Button({ label, variant = 'primary', disabled, onClick, className }: ButtonProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			className={cn(
				'rounded-md px-4 py-2 text-sm font-medium transition-colors',
				variantStyles[variant],
				disabled && 'cursor-not-allowed opacity-50',
				className,
			)}
			onClick={onClick}
		>
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
	}),
	acceptsChildren: false,
};

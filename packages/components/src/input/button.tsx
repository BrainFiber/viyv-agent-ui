import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

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
	secondary: 'bg-muted text-fg-secondary hover:bg-muted-strong border',
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
				'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
				variantStyles[variant],
				isDisabled && 'cursor-not-allowed opacity-50',
				className,
			)}
			onClick={onClick}
		>
			{loading && (
				<svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
					<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
				</svg>
			)}
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

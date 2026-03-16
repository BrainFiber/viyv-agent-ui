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
	primary: 'bg-blue-600 text-white hover:bg-blue-700',
	secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border',
	danger: 'bg-red-600 text-white hover:bg-red-700',
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

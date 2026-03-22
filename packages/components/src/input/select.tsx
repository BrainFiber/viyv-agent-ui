import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProps {
	options: SelectOption[];
	placeholder?: string;
	label?: string;
	value?: string;
	disabled?: boolean;
	error?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function Select({
	options,
	placeholder,
	label,
	value,
	disabled,
	error,
	onChange,
	className,
}: SelectProps) {
	const errorId = useId();
	return (
		<label className={cn('block space-y-1', className)}>
			{label && <span className="text-sm font-medium text-fg-secondary">{label}</span>}
			<select
				value={value ?? ''}
				disabled={disabled}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					'w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
					disabled && 'cursor-not-allowed bg-muted opacity-50',
					error && 'border-danger',
				)}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
			{error && <span id={errorId} role="alert" className="text-sm text-danger">{error}</span>}
		</label>
	);
}

export const selectMeta: ComponentMeta = {
	type: 'Select',
	label: 'Select',
	description: 'Dropdown select',
	category: 'input',
	propsSchema: z.object({
		options: z.array(z.object({ value: z.string(), label: z.string() })),
		placeholder: z.string().optional(),
		label: z.string().optional(),
		error: z.string().optional(),
	}),
	acceptsChildren: false,
};

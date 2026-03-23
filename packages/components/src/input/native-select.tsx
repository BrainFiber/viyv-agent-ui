import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';

export interface NativeSelectOption {
	value: string;
	label: string;
}

export interface NativeSelectProps {
	options: NativeSelectOption[];
	placeholder?: string;
	label?: string;
	value?: string;
	disabled?: boolean;
	error?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function NativeSelect({
	options,
	placeholder,
	label,
	value,
	disabled,
	error,
	onChange,
	className,
}: NativeSelectProps) {
	const errorId = useId();
	return (
		<div className={cn('block space-y-1', className)}>
			{label && <span className="block text-sm font-medium text-fg-secondary">{label}</span>}
			<select
				value={value ?? ''}
				disabled={disabled}
				aria-invalid={!!error || undefined}
				aria-describedby={error ? errorId : undefined}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					'flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-fg shadow-sm transition-colors',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
					'disabled:cursor-not-allowed disabled:opacity-50',
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
			{error && (
				<span id={errorId} role="alert" className="text-sm text-danger">
					{error}
				</span>
			)}
		</div>
	);
}

export const nativeSelectMeta: ComponentMeta = {
	type: 'NativeSelect',
	label: 'Native Select',
	description: 'Native HTML select dropdown for mobile-friendly usage',
	category: 'input',
	propsSchema: z.object({
		options: z.array(z.object({ value: z.string(), label: z.string() })),
		placeholder: z.string().optional(),
		label: z.string().optional(),
		error: z.string().optional(),
	}),
	acceptsChildren: false,
};

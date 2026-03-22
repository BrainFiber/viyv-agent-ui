import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';

export interface RadioGroupOption {
	value: string;
	label: string;
}

export interface RadioGroupProps {
	label?: string;
	options: RadioGroupOption[];
	value?: string;
	disabled?: boolean;
	error?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function RadioGroup({
	label,
	options,
	value,
	disabled,
	error,
	onChange,
	className,
}: RadioGroupProps) {
	const groupName = useId();
	const errorId = useId();
	return (
		<fieldset className={cn('space-y-2', className)} aria-invalid={!!error} aria-describedby={error ? errorId : undefined}>
			{label && <legend className="text-sm font-medium text-fg-secondary">{label}</legend>}
			{options.map((opt) => (
				<label
					key={opt.value}
					className={cn(
						'flex items-center gap-2',
						disabled && 'cursor-not-allowed opacity-50',
					)}
				>
					<input
						type="radio"
						name={groupName}
						value={opt.value}
						checked={value === opt.value}
						disabled={disabled}
						onChange={() => onChange?.(opt.value)}
						className="h-4 w-4 border-border-strong text-primary focus:ring-2 focus:ring-ring/30 focus:ring-offset-1"
					/>
					<span className="text-sm text-fg-secondary">{opt.label}</span>
				</label>
			))}
			{error && <span id={errorId} role="alert" className="text-sm text-danger">{error}</span>}
		</fieldset>
	);
}

export const radioGroupMeta: ComponentMeta = {
	type: 'RadioGroup',
	label: 'Radio Group',
	description: 'Radio button group for single selection',
	category: 'input',
	propsSchema: z.object({
		options: z.array(z.object({ value: z.string(), label: z.string() })),
		label: z.string().optional(),
		error: z.string().optional(),
	}),
	acceptsChildren: false,
};

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';
import * as SelectUI from '../ui/select.js';

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
		<div className={cn('block space-y-1', className)}>
			{label && <span className="block text-sm font-medium text-fg-secondary">{label}</span>}
			<SelectUI.Root
				value={value}
				disabled={disabled}
				onValueChange={(v) => onChange?.(v)}
			>
				<SelectUI.Trigger
					aria-invalid={!!error || undefined}
					aria-describedby={error ? errorId : undefined}
					className={cn(error && 'border-danger')}
				>
					<SelectUI.Value placeholder={placeholder} />
				</SelectUI.Trigger>
				<SelectUI.Content>
					{options.map((opt) => (
						<SelectUI.Item key={opt.value} value={opt.value}>
							{opt.label}
						</SelectUI.Item>
					))}
				</SelectUI.Content>
			</SelectUI.Root>
			{error && (
				<span id={errorId} role="alert" className="text-sm text-danger">
					{error}
				</span>
			)}
		</div>
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

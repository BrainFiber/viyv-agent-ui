import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';
import * as RadioGroupUI from '../ui/radio-group.js';

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
	const instanceId = useId();
	const errorId = useId();
	return (
		<div className={cn('space-y-2', className)}>
			{label && <span className="block text-sm font-medium text-fg-secondary">{label}</span>}
			<RadioGroupUI.Root
				value={value}
				disabled={disabled}
				onValueChange={(v) => onChange?.(v)}
				aria-invalid={!!error || undefined}
				aria-describedby={error ? errorId : undefined}
			>
				{options.map((opt) => {
					const itemId = `${instanceId}-${opt.value}`;
					return (
						<div key={opt.value} className="flex items-center gap-2">
							<RadioGroupUI.Item value={opt.value} id={itemId}>
								<RadioGroupUI.Indicator />
							</RadioGroupUI.Item>
							<label htmlFor={itemId} className="text-sm text-fg-secondary">
								{opt.label}
							</label>
						</div>
					);
				})}
			</RadioGroupUI.Root>
			{error && (
				<span id={errorId} role="alert" className="text-sm text-danger">
					{error}
				</span>
			)}
		</div>
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

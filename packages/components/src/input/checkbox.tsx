import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';
import * as CheckboxUI from '../ui/checkbox.js';

export interface CheckboxProps {
	label?: string;
	checked?: boolean;
	disabled?: boolean;
	error?: string;
	onChange?: (checked: boolean) => void;
	className?: string;
}

export function Checkbox({
	label,
	checked,
	disabled,
	error,
	onChange,
	className,
}: CheckboxProps) {
	const id = useId();
	const errorId = useId();
	return (
		<div className={className}>
			<div className={cn('inline-flex items-center gap-2', disabled && 'cursor-not-allowed opacity-50')}>
				<CheckboxUI.Root
					id={id}
					checked={checked ?? false}
					disabled={disabled}
					aria-invalid={!!error || undefined}
					aria-describedby={error ? errorId : undefined}
					onCheckedChange={(v) => onChange?.(v === true)}
					className={cn(error && 'border-danger')}
				>
					<CheckboxUI.Indicator />
				</CheckboxUI.Root>
				{label && (
					<label htmlFor={id} className="text-sm text-fg-secondary">
						{label}
					</label>
				)}
			</div>
			{error && (
				<span id={errorId} role="alert" className="mt-1 block text-sm text-danger">
					{error}
				</span>
			)}
		</div>
	);
}

export const checkboxMeta: ComponentMeta = {
	type: 'Checkbox',
	label: 'Checkbox',
	description: 'Checkbox toggle',
	category: 'input',
	propsSchema: z.object({
		label: z.string().optional(),
		error: z.string().optional(),
	}),
	acceptsChildren: false,
};

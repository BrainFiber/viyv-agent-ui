import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';

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
	const errorId = useId();
	return (
		<div className={className}>
			<label className={cn('inline-flex items-center gap-2', disabled && 'cursor-not-allowed opacity-50')}>
				<input
					type="checkbox"
					checked={checked ?? false}
					disabled={disabled}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : undefined}
					onChange={(e) => onChange?.(e.target.checked)}
					className="h-4 w-4 rounded border-border-strong text-primary focus:ring-2 focus:ring-ring/30 focus:ring-offset-1"
				/>
				{label && <span className="text-sm text-fg-secondary">{label}</span>}
			</label>
			{error && <span id={errorId} role="alert" className="text-sm text-danger">{error}</span>}
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

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';

export interface TextareaProps {
	label?: string;
	placeholder?: string;
	value?: string;
	rows?: number;
	disabled?: boolean;
	error?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function Textarea({
	label,
	placeholder,
	value,
	rows = 3,
	disabled,
	error,
	onChange,
	className,
}: TextareaProps) {
	const errorId = useId();
	return (
		<label className={cn('block space-y-1', className)}>
			{label && <span className="text-sm font-medium text-fg-secondary">{label}</span>}
			<textarea
				value={value ?? ''}
				placeholder={placeholder}
				rows={rows}
				disabled={disabled}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					'block w-full resize-y rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
					disabled && 'cursor-not-allowed bg-muted opacity-50',
					error && 'border-danger',
				)}
			/>
			{error && <span id={errorId} role="alert" className="text-sm text-danger">{error}</span>}
		</label>
	);
}

export const textareaMeta: ComponentMeta = {
	type: 'Textarea',
	label: 'Textarea',
	description: 'Multi-line text input',
	category: 'input',
	propsSchema: z.object({
		label: z.string().optional(),
		placeholder: z.string().optional(),
		rows: z.number().optional(),
		error: z.string().optional(),
	}),
	acceptsChildren: false,
};

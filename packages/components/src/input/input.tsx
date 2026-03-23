import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';

export interface InputProps {
	label?: string;
	placeholder?: string;
	value?: string;
	disabled?: boolean;
	error?: string;
	type?: 'text' | 'number' | 'date' | 'email' | 'tel' | 'url';
	onChange?: (value: string) => void;
	className?: string;
}

export function Input({
	label,
	placeholder,
	value,
	disabled,
	error,
	type,
	onChange,
	className,
}: InputProps) {
	const errorId = useId();
	return (
		<label className={cn('block space-y-1', className)}>
			{label && <span className="text-sm font-medium text-fg-secondary">{label}</span>}
			<input
				type={type ?? 'text'}
				value={value ?? ''}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				onChange={(e) => {
					const v = e.target.value;
					onChange?.(type === 'number' ? (v === '' ? '' : Number(v)) as any : v);
				}}
				className={cn(
					'block w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
					disabled && 'cursor-not-allowed bg-muted opacity-50',
					error && 'border-danger',
				)}
			/>
			{error && <span id={errorId} role="alert" className="text-sm text-danger">{error}</span>}
		</label>
	);
}

export const inputMeta: ComponentMeta = {
	type: 'Input',
	label: 'Input',
	description: 'Text input field',
	category: 'input',
	propsSchema: z.object({
		label: z.string().optional(),
		placeholder: z.string().optional(),
		error: z.string().optional(),
		type: z.enum(['text', 'number', 'date', 'email', 'tel', 'url']).optional(),
	}),
	acceptsChildren: false,
};

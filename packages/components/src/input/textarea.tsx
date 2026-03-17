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
			{label && <span className="text-sm font-medium text-gray-700">{label}</span>}
			<textarea
				value={value ?? ''}
				placeholder={placeholder}
				rows={rows}
				disabled={disabled}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					'block w-full resize-y rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
					disabled && 'cursor-not-allowed bg-gray-100 opacity-50',
					error && 'border-red-500',
				)}
			/>
			{error && <span id={errorId} role="alert" className="text-sm text-red-600">{error}</span>}
		</label>
	);
}

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
			{label && <span className="text-sm font-medium text-gray-700">{label}</span>}
			<select
				value={value ?? ''}
				disabled={disabled}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					'w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
					disabled && 'cursor-not-allowed bg-gray-100 opacity-50',
					error && 'border-red-500',
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
			{error && <span id={errorId} role="alert" className="text-sm text-red-600">{error}</span>}
		</label>
	);
}

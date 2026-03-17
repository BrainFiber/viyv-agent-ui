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
			{label && <legend className="text-sm font-medium text-gray-700">{label}</legend>}
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
						className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<span className="text-sm text-gray-700">{opt.label}</span>
				</label>
			))}
			{error && <span id={errorId} role="alert" className="text-sm text-red-600">{error}</span>}
		</fieldset>
	);
}

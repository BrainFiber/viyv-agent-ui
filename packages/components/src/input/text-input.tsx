import { cn } from '../lib/cn.js';

export interface TextInputProps {
	label?: string;
	placeholder?: string;
	value?: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
	className?: string;
}

export function TextInput({
	label,
	placeholder,
	value,
	disabled,
	onChange,
	className,
}: TextInputProps) {
	return (
		<label className={cn('block space-y-1', className)}>
			{label && <span className="text-sm font-medium text-gray-700">{label}</span>}
			<input
				type="text"
				value={value ?? ''}
				placeholder={placeholder}
				disabled={disabled}
				onChange={(e) => onChange?.(e.target.value)}
				className={cn(
					'block w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
					disabled && 'cursor-not-allowed bg-gray-100 opacity-50',
				)}
			/>
		</label>
	);
}

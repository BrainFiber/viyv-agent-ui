import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useRef, useId } from 'react';
import { cn } from '../lib/cn.js';

export interface AutocompleteProps {
	options: Array<{ value: string; label: string }>;
	placeholder?: string;
	label?: string;
	value?: string;
	disabled?: boolean;
	error?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function Autocomplete({
	options,
	placeholder,
	label,
	value,
	disabled,
	error,
	onChange,
	className,
}: AutocompleteProps) {
	const [query, setQuery] = useState('');
	const [open, setOpen] = useState(false);
	const listboxId = useId();
	const errorId = useId();
	const inputRef = useRef<HTMLInputElement>(null);

	const selectedLabel = options.find((o) => o.value === value)?.label ?? '';
	const displayValue = open ? query : selectedLabel;

	const filtered = options.filter((o) =>
		o.label.toLowerCase().includes(query.toLowerCase()),
	);

	const handleSelect = (opt: { value: string; label: string }) => {
		onChange?.(opt.value);
		setQuery('');
		setOpen(false);
		inputRef.current?.blur();
	};

	return (
		<div className={cn('relative', className)}>
			{label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
			<input
				ref={inputRef}
				role="combobox"
				aria-autocomplete="list"
				aria-expanded={open}
				aria-controls={listboxId}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				value={displayValue}
				placeholder={placeholder}
				disabled={disabled}
				onChange={(e) => {
					setQuery(e.target.value);
					setOpen(true);
				}}
				onFocus={() => {
					setQuery('');
					setOpen(true);
				}}
				onBlur={() => setTimeout(() => setOpen(false), 150)}
				className={cn(
					'w-full rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500',
					disabled && 'cursor-not-allowed bg-gray-100 opacity-50',
					error && 'border-red-500',
				)}
			/>
			{open && filtered.length > 0 && (
				<ul
					id={listboxId}
					role="listbox"
					className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white py-1 shadow-lg"
				>
					{filtered.map((opt) => (
						<li
							key={opt.value}
							role="option"
							aria-selected={opt.value === value}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => handleSelect(opt)}
							className={cn(
								'cursor-pointer px-3 py-2 text-sm hover:bg-blue-50',
								opt.value === value && 'bg-blue-50 font-medium text-blue-700',
							)}
						>
							{opt.label}
						</li>
					))}
				</ul>
			)}
			{error && <span id={errorId} role="alert" className="mt-1 block text-sm text-red-600">{error}</span>}
		</div>
	);
}

export const autocompleteMeta: ComponentMeta = {
	type: 'Autocomplete',
	label: 'Autocomplete',
	description: 'Input with type-ahead suggestions',
	category: 'input',
	propsSchema: z.object({
		options: z.array(z.object({ value: z.string(), label: z.string() })),
		placeholder: z.string().optional(),
		label: z.string().optional(),
		error: z.string().optional(),
	}),
	acceptsChildren: false,
};

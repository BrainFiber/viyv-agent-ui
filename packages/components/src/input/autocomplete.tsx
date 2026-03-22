import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useRef, useId, useEffect } from 'react';
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
	const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (blurTimerRef.current !== null) {
				clearTimeout(blurTimerRef.current);
			}
		};
	}, []);

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
			{label && <span className="mb-1 block text-sm font-medium text-fg-secondary">{label}</span>}
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
					if (blurTimerRef.current) {
						clearTimeout(blurTimerRef.current);
						blurTimerRef.current = null;
					}
					setQuery('');
					setOpen(true);
				}}
				onBlur={() => {
					blurTimerRef.current = setTimeout(() => setOpen(false), 150);
				}}
				className={cn(
					'w-full rounded-md border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring',
					disabled && 'cursor-not-allowed bg-muted opacity-50',
					error && 'border-danger',
				)}
			/>
			{open && filtered.length > 0 && (
				<ul
					id={listboxId}
					role="listbox"
					className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-surface py-1 shadow-lg"
				>
					{filtered.map((opt) => (
						<li
							key={opt.value}
							role="option"
							aria-selected={opt.value === value}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => handleSelect(opt)}
							className={cn(
								'cursor-pointer px-3 py-2 text-sm hover:bg-primary-soft',
								opt.value === value && 'bg-primary-soft font-medium text-primary-soft-fg',
							)}
						>
							{opt.label}
						</li>
					))}
				</ul>
			)}
			{error && <span id={errorId} role="alert" className="mt-1 block text-sm text-danger">{error}</span>}
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

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useRef, useEffect, useId } from 'react';
import { cn } from '../lib/cn.js';
import { Calendar } from '../display/calendar.js';

export interface DatePickerProps {
	label?: string;
	value?: string;
	placeholder?: string;
	disabled?: boolean;
	error?: string;
	onChange?: (value: string) => void;
	className?: string;
}

function formatDisplayDate(iso: string): string {
	if (!iso) return '';
	const [y, m, d] = iso.split('-');
	if (!y || !m || !d) return iso;
	return `${y}/${m}/${d}`;
}

export function DatePicker({
	label,
	value,
	placeholder = '日付を選択',
	disabled,
	error,
	onChange,
	className,
}: DatePickerProps) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const inputId = useId();
	const errorId = useId();

	// Close on click outside
	useEffect(() => {
		if (!open) return;
		const handleClick = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClick);
		return () => document.removeEventListener('mousedown', handleClick);
	}, [open]);

	const handleDateClick = (date: string) => {
		onChange?.(date);
		setOpen(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			setOpen(false);
		} else if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (!disabled) setOpen(!open);
		}
	};

	const defaultMonth = value ? value.slice(0, 7) : undefined;

	return (
		<div ref={containerRef} className={cn('relative', className)}>
			{label && (
				<label htmlFor={inputId} className="mb-1 block text-sm font-medium text-fg-secondary">
					{label}
				</label>
			)}
			<button
				id={inputId}
				type="button"
				role="combobox"
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-invalid={!!error || undefined}
				aria-describedby={error ? errorId : undefined}
				disabled={disabled}
				onClick={() => setOpen(!open)}
				onKeyDown={handleKeyDown}
				className={cn(
					'flex w-full items-center rounded-lg border border-border-strong bg-surface px-3 py-2 text-left text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
					disabled && 'cursor-not-allowed bg-muted opacity-50',
					error && 'border-danger',
					!value && 'text-fg-muted',
				)}
			>
				{value ? formatDisplayDate(value) : placeholder}
				<span className="ml-auto text-fg-subtle" aria-hidden="true">&#x25BC;</span>
			</button>
			{open && (
				<div
					role="dialog"
					aria-label="日付選択"
					className="absolute z-50 mt-1 rounded-lg border bg-surface shadow-xl animate-dropdown-in"
				>
					<Calendar
						defaultMonth={defaultMonth}
						onDateClick={handleDateClick}
					/>
				</div>
			)}
			{error && <span id={errorId} role="alert" className="mt-1 block text-sm text-danger">{error}</span>}
		</div>
	);
}

export const datePickerMeta: ComponentMeta = {
	type: 'DatePicker',
	label: 'Date Picker',
	description: 'Date input with calendar popup',
	category: 'input',
	propsSchema: z.object({
		label: z.string().optional(),
		placeholder: z.string().optional(),
		error: z.string().optional(),
	}),
	acceptsChildren: false,
};

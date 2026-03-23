import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useId } from 'react';
import { cn } from '../lib/cn.js';
import { Check } from '../lib/icons.js';
import * as Popover from '../ui/popover.js';
import * as Command from '../ui/command.js';

export interface ComboboxProps {
	options: Array<{ value: string; label: string }>;
	placeholder?: string;
	label?: string;
	value?: string;
	disabled?: boolean;
	error?: string;
	onChange?: (value: string) => void;
	className?: string;
}

export function Combobox({
	options,
	placeholder,
	label,
	value,
	disabled,
	error,
	onChange,
	className,
}: ComboboxProps) {
	const [open, setOpen] = useState(false);
	const errorId = useId();

	const selectedLabel = options.find((o) => o.value === value)?.label ?? '';

	return (
		<div className={cn('relative', className)}>
			{label && <span className="mb-1 block text-sm font-medium text-fg-secondary">{label}</span>}
			<Popover.Root open={open} onOpenChange={setOpen}>
				<Popover.Trigger asChild disabled={disabled}>
					<button
						type="button"
						role="combobox"
						aria-expanded={open}
						aria-invalid={!!error || undefined}
						aria-describedby={error ? errorId : undefined}
						disabled={disabled}
						className={cn(
							'flex w-full items-center justify-between rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm shadow-sm transition-colors',
							'placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
							'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50',
							error && 'border-danger',
							!value && 'text-fg-subtle',
						)}
					>
						{selectedLabel || placeholder || 'Select...'}
					</button>
				</Popover.Trigger>
				<Popover.Content>
					<Command.Root>
						<Command.Input placeholder={placeholder ?? 'Search...'} />
						<Command.List>
							<Command.Empty>No results found.</Command.Empty>
							{options.map((opt) => (
								<Command.Item
									key={opt.value}
									value={opt.label}
									onSelect={() => {
										onChange?.(opt.value === value ? '' : opt.value);
										setOpen(false);
									}}
								>
									<Check
										className={cn(
											'mr-2 h-4 w-4',
											opt.value === value ? 'opacity-100' : 'opacity-0',
										)}
									/>
									{opt.label}
								</Command.Item>
							))}
						</Command.List>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			{error && (
				<span id={errorId} role="alert" className="mt-1 block text-sm text-danger">
					{error}
				</span>
			)}
		</div>
	);
}

export const comboboxMeta: ComponentMeta = {
	type: 'Combobox',
	label: 'Combobox',
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

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';

export interface SliderProps {
	min?: number;
	max?: number;
	step?: number;
	value?: number;
	label?: string;
	showValue?: boolean;
	disabled?: boolean;
	error?: string;
	onChange?: (value: number) => void;
	className?: string;
}

export function Slider({
	min = 0,
	max = 100,
	step = 1,
	value,
	label,
	showValue,
	disabled,
	error,
	onChange,
	className,
}: SliderProps) {
	const id = useId();
	const errorId = useId();
	const current = value ?? min;
	return (
		<div className={cn('space-y-1', className)}>
			{(label || showValue) && (
				<div className="flex items-center justify-between">
					{label && <label htmlFor={id} className="text-sm font-medium text-fg-secondary">{label}</label>}
					{showValue && <span className="text-sm text-fg-muted">{current}</span>}
				</div>
			)}
			<input
				id={id}
				type="range"
				min={min}
				max={max}
				step={step}
				value={current}
				disabled={disabled}
				aria-invalid={!!error || undefined}
				aria-describedby={error ? errorId : undefined}
				onChange={(e) => onChange?.(Number(e.target.value))}
				className={cn(
					'w-full accent-primary',
					disabled && 'cursor-not-allowed opacity-50',
					error && 'accent-danger',
				)}
			/>
			{error && <span id={errorId} role="alert" className="mt-1 block text-sm text-danger">{error}</span>}
		</div>
	);
}

export const sliderMeta: ComponentMeta = {
	type: 'Slider',
	label: 'Slider',
	description: 'Range value selection slider',
	category: 'input',
	propsSchema: z.object({
		min: z.number().optional(),
		max: z.number().optional(),
		step: z.number().optional(),
		label: z.string().optional(),
		showValue: z.boolean().optional(),
		error: z.string().optional(),
	}),
	acceptsChildren: false,
};

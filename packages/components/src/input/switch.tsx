import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';

export interface SwitchProps {
	label?: string;
	checked?: boolean;
	disabled?: boolean;
	error?: string;
	onChange?: (checked: boolean) => void;
	className?: string;
}

export function Switch({ label, checked, disabled, error, onChange, className }: SwitchProps) {
	const errorId = useId();
	return (
		<div className={className}>
			<label className={cn('inline-flex items-center gap-3', disabled && 'cursor-not-allowed opacity-50')}>
				<button
					type="button"
					role="switch"
					aria-checked={checked ?? false}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : undefined}
					disabled={disabled}
					onClick={() => onChange?.(!checked)}
					className={cn(
						'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
						checked ? 'bg-blue-600' : 'bg-gray-200',
					)}
				>
					<span
						aria-hidden="true"
						className={cn(
							'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform',
							checked ? 'translate-x-5' : 'translate-x-0',
						)}
					/>
				</button>
				{label && <span className="text-sm text-gray-700">{label}</span>}
			</label>
			{error && <span id={errorId} role="alert" className="mt-1 block text-sm text-red-600">{error}</span>}
		</div>
	);
}

export const switchMeta: ComponentMeta = {
	type: 'Switch',
	label: 'Switch',
	description: 'ON/OFF toggle switch',
	category: 'input',
	propsSchema: z.object({
		label: z.string().optional(),
		error: z.string().optional(),
	}),
	acceptsChildren: false,
};

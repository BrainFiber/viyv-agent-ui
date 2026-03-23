import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';
import * as SwitchUI from '../ui/switch.js';

export interface SwitchProps {
	label?: string;
	checked?: boolean;
	disabled?: boolean;
	error?: string;
	onChange?: (checked: boolean) => void;
	className?: string;
}

export function Switch({ label, checked, disabled, error, onChange, className }: SwitchProps) {
	const id = useId();
	const errorId = useId();
	return (
		<div className={className}>
			<div className={cn('inline-flex items-center gap-3', disabled && 'cursor-not-allowed opacity-50')}>
				<SwitchUI.Root
					id={id}
					checked={checked ?? false}
					disabled={disabled}
					aria-invalid={!!error || undefined}
					aria-describedby={error ? errorId : undefined}
					onCheckedChange={(v) => onChange?.(v === true)}
					className={cn(error && 'ring-2 ring-danger/30')}
				>
					<SwitchUI.Thumb />
				</SwitchUI.Root>
				{label && (
					<label htmlFor={id} className="text-sm text-fg-secondary">
						{label}
					</label>
				)}
			</div>
			{error && (
				<span id={errorId} role="alert" className="mt-1 block text-sm text-danger">
					{error}
				</span>
			)}
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

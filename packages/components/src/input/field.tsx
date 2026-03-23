import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useId } from 'react';
import { cn } from '../lib/cn.js';

export interface FieldProps {
	label?: string;
	error?: string;
	description?: string;
	required?: boolean;
	children?: ReactNode;
	className?: string;
}

export function Field({
	label,
	error,
	description,
	required,
	children,
	className,
}: FieldProps) {
	const id = useId();
	const descId = `${id}-desc`;
	const errorId = `${id}-error`;

	return (
		<div className={cn('flex flex-col gap-1.5', className)}>
			{label && (
				<label
					className="text-sm font-medium leading-none text-fg"
				>
					{label}
					{required && (
						<span className="ml-0.5 text-danger" aria-hidden="true">
							*
						</span>
					)}
				</label>
			)}
			{children}
			{description && !error && (
				<p id={descId} className="text-xs text-fg-tertiary">
					{description}
				</p>
			)}
			{error && (
				<p id={errorId} role="alert" className="text-xs text-danger">
					{error}
				</p>
			)}
		</div>
	);
}

export const fieldMeta: ComponentMeta = {
	type: 'Field',
	label: 'Field',
	description: 'Form field wrapper with label, description, and error display',
	category: 'input',
	propsSchema: z.object({
		label: z.string().optional(),
		error: z.string().optional(),
		description: z.string().optional(),
		required: z.boolean().optional(),
	}),
	acceptsChildren: true,
};

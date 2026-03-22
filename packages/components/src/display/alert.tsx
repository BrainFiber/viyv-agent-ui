import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState } from 'react';
import { cn } from '../lib/cn.js';

export interface AlertProps {
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	title?: string;
	closable?: boolean;
	onClose?: () => void;
	className?: string;
}

const typeStyles: Record<string, string> = {
	info: 'border-primary-soft-border bg-primary-soft text-primary-soft-fg',
	success: 'border-success-soft-border bg-success-soft text-success-soft-fg',
	warning: 'border-warning-soft-border bg-warning-soft text-warning-soft-fg',
	error: 'border-danger-soft-border bg-danger-soft text-danger-soft-fg',
};

export function Alert({ message, type = 'info', title, closable, onClose, className }: AlertProps) {
	const [visible, setVisible] = useState(true);

	if (!visible) return null;

	const handleClose = () => {
		setVisible(false);
		onClose?.();
	};

	return (
		<div
			role="alert"
			className={cn(
				'rounded-lg border p-4',
				closable && 'flex justify-between',
				typeStyles[type] ?? typeStyles.info,
				className,
			)}
		>
			<div>
				{title && <p className="mb-1 font-medium">{title}</p>}
				<p>{message}</p>
			</div>
			{closable && (
				<button
					type="button"
					className="ml-4 shrink-0 opacity-60 hover:opacity-100"
					onClick={handleClose}
					aria-label="Close"
				>
					&#x2715;
				</button>
			)}
		</div>
	);
}

export const alertMeta: ComponentMeta = {
	type: 'Alert',
	label: 'Alert',
	description: 'Feedback message (info, success, warning, error)',
	category: 'display',
	propsSchema: z.object({
		message: z.string(),
		type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
		title: z.string().optional(),
		closable: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

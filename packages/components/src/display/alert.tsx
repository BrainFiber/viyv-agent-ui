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
	info: 'border-blue-200 bg-blue-50 text-blue-800',
	success: 'border-green-200 bg-green-50 text-green-800',
	warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
	error: 'border-red-200 bg-red-50 text-red-800',
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

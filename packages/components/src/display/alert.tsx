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
	info: 'border-primary-soft-border border-l-primary bg-primary-soft text-primary-soft-fg',
	success: 'border-success-soft-border border-l-success bg-success-soft text-success-soft-fg',
	warning: 'border-warning-soft-border border-l-warning bg-warning-soft text-warning-soft-fg',
	error: 'border-danger-soft-border border-l-danger bg-danger-soft text-danger-soft-fg',
};

const alertIcons: Record<string, React.ReactNode> = {
	info: (
		<svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
	success: (
		<svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
	warning: (
		<svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
		</svg>
	),
	error: (
		<svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	),
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
				'rounded-lg border border-l-4 p-4',
				typeStyles[type] ?? typeStyles.info,
				className,
			)}
		>
			<div className="flex gap-3">
				{alertIcons[type]}
				<div className="flex-1">
					{title && <p className="mb-1 font-medium">{title}</p>}
					<p>{message}</p>
				</div>
				{closable && (
					<button
						type="button"
						className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
						onClick={handleClose}
						aria-label="Close"
					>
						&#x2715;
					</button>
				)}
			</div>
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

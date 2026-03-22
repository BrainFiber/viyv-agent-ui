import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useEffect } from 'react';
import { cn } from '../lib/cn.js';

export interface ToastProps {
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	duration?: number;
	position?: 'top' | 'bottom' | 'top-right' | 'bottom-right';
	closable?: boolean;
	className?: string;
}

const typeStyles: Record<string, string> = {
	info: 'border-blue-200 bg-blue-50 text-blue-800',
	success: 'border-green-200 bg-green-50 text-green-800',
	warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
	error: 'border-red-200 bg-red-50 text-red-800',
};

const positionStyles: Record<string, string> = {
	top: 'top-4 left-1/2 -translate-x-1/2',
	bottom: 'bottom-4 left-1/2 -translate-x-1/2',
	'top-right': 'top-4 right-4',
	'bottom-right': 'bottom-4 right-4',
};

export function Toast({
	message,
	type = 'info',
	duration = 5000,
	position = 'top-right',
	closable = true,
	className,
}: ToastProps) {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		if (duration <= 0) return;
		const timer = setTimeout(() => setVisible(false), duration);
		return () => clearTimeout(timer);
	}, [duration]);

	if (!visible) return null;

	return (
		<div
			role="status"
			aria-live="polite"
			aria-atomic="true"
			className={cn(
				'fixed z-50 min-w-[280px] max-w-sm rounded-lg border p-4 shadow-lg',
				typeStyles[type] ?? typeStyles.info,
				positionStyles[position] ?? positionStyles['top-right'],
				className,
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<p className="text-sm">{message}</p>
				{closable && (
					<button
						type="button"
						onClick={() => setVisible(false)}
						aria-label="Close"
						className="shrink-0 opacity-60 hover:opacity-100"
					>
						&#x2715;
					</button>
				)}
			</div>
		</div>
	);
}

export const toastMeta: ComponentMeta = {
	type: 'Toast',
	label: 'Toast',
	description: 'Temporary notification message',
	category: 'feedback',
	propsSchema: z.object({
		message: z.string(),
		type: z.enum(['info', 'success', 'warning', 'error']).optional(),
		duration: z.number().optional(),
		position: z.enum(['top', 'bottom', 'top-right', 'bottom-right']).optional(),
		closable: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

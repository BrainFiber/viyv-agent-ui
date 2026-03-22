import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { toastVariants } from '../lib/motion-presets.js';

export interface ToastProps {
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	duration?: number;
	position?: 'top' | 'bottom' | 'top-right' | 'bottom-right';
	closable?: boolean;
	className?: string;
}

const typeStyles: Record<string, string> = {
	info: 'border-primary-soft-border bg-primary-soft text-primary-soft-fg',
	success: 'border-success-soft-border bg-success-soft text-success-soft-fg',
	warning: 'border-warning-soft-border bg-warning-soft text-warning-soft-fg',
	error: 'border-danger-soft-border bg-danger-soft text-danger-soft-fg',
};

const positionStyles: Record<string, string> = {
	top: 'top-4 left-1/2 -translate-x-1/2',
	bottom: 'bottom-4 left-1/2 -translate-x-1/2',
	'top-right': 'top-4 right-2 sm:right-4',
	'bottom-right': 'bottom-4 right-2 sm:right-4',
};

export function Toast({
	message,
	type = 'info',
	duration = 5000,
	position,
	closable = true,
	className,
}: ToastProps) {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		if (duration <= 0) return;
		const timer = setTimeout(() => setVisible(false), duration);
		return () => clearTimeout(timer);
	}, [duration]);

	const isStandalone = !!position;

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					role="status"
					aria-live="polite"
					aria-atomic="true"
					variants={toastVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
					className={cn(
						'min-w-0 max-w-[calc(100vw-2rem)] rounded-xl border p-4 shadow-lg sm:min-w-[280px] sm:max-w-sm',
						isStandalone && 'fixed z-50',
						isStandalone && (positionStyles[position] ?? positionStyles['top-right']),
						typeStyles[type] ?? typeStyles.info,
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
								className="shrink-0 opacity-60 transition-opacity hover:opacity-100"
							>
								&#x2715;
							</button>
						)}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
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

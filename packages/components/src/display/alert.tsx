import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn.js';
import { Info, CircleCheck, TriangleAlert, CircleX, X } from '../lib/icons.js';

const alertVariants = cva('rounded-lg border border-l-4 p-4', {
	variants: {
		type: {
			info: 'border-primary-soft-border border-l-primary bg-primary-soft text-primary-soft-fg',
			success: 'border-success-soft-border border-l-success bg-success-soft text-success-soft-fg',
			warning: 'border-warning-soft-border border-l-warning bg-warning-soft text-warning-soft-fg',
			error: 'border-danger-soft-border border-l-danger bg-danger-soft text-danger-soft-fg',
		},
	},
	defaultVariants: { type: 'info' },
});

export interface AlertProps extends VariantProps<typeof alertVariants> {
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	title?: string;
	closable?: boolean;
	onClose?: () => void;
	className?: string;
}

const alertIcons: Record<string, React.ReactNode> = {
	info: <Info aria-hidden="true" className="h-5 w-5 shrink-0" />,
	success: <CircleCheck aria-hidden="true" className="h-5 w-5 shrink-0" />,
	warning: <TriangleAlert aria-hidden="true" className="h-5 w-5 shrink-0" />,
	error: <CircleX aria-hidden="true" className="h-5 w-5 shrink-0" />,
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
			className={cn(alertVariants({ type }), className)}
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
						<X aria-hidden="true" className="h-4 w-4" />
					</button>
				)}
			</div>
		</div>
	);
}

export { alertVariants };

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

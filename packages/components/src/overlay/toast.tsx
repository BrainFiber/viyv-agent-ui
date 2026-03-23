import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { X } from '../lib/icons.js';
import * as T from '../ui/toast.js';

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

export function Toast({ message, type = 'info', duration = 5000, closable = true, className }: ToastProps) {
	return (
		<T.Root
			duration={duration}
			type={type === 'error' || type === 'warning' ? 'foreground' : 'background'}
			className={cn(
				'min-w-0 max-w-[calc(100vw-2rem)] sm:min-w-[280px] sm:max-w-sm',
				typeStyles[type] ?? typeStyles.info,
				className,
			)}
		>
			<div className="flex items-start justify-between gap-2">
				<T.Description className="text-sm">{message}</T.Description>
				{closable && (
					<T.Close aria-label="Close">
						<X aria-hidden="true" className="h-4 w-4" />
					</T.Close>
				)}
			</div>
		</T.Root>
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

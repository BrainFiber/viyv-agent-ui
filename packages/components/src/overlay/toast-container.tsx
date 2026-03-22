import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface ToastContainerProps {
	position?: 'top' | 'bottom' | 'top-right' | 'bottom-right';
	children?: ReactNode;
	className?: string;
}

const positionStyles: Record<string, string> = {
	top: 'top-4 left-1/2 -translate-x-1/2 items-center',
	bottom: 'bottom-4 left-1/2 -translate-x-1/2 items-center',
	'top-right': 'top-4 right-2 sm:right-4 items-end',
	'bottom-right': 'bottom-4 right-2 sm:right-4 items-end',
};

export function ToastContainer({
	position = 'top-right',
	children,
	className,
}: ToastContainerProps) {
	return (
		<div
			aria-live="polite"
			className={cn(
				'fixed z-50 flex flex-col gap-3',
				positionStyles[position] ?? positionStyles['top-right'],
				className,
			)}
		>
			{children}
		</div>
	);
}

export const toastContainerMeta: ComponentMeta = {
	type: 'ToastContainer',
	label: 'Toast Container',
	description: 'Stacking container for multiple Toast notifications',
	category: 'feedback',
	propsSchema: z.object({
		position: z.enum(['top', 'bottom', 'top-right', 'bottom-right']).optional(),
	}),
	acceptsChildren: true,
};

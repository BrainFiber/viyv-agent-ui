import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { ReactNode } from 'react';
import * as T from '../ui/toast.js';
import { cn } from '../lib/cn.js';

export interface ToastContainerProps {
	position?: 'top' | 'bottom' | 'top-right' | 'bottom-right';
	children?: ReactNode;
	className?: string;
}

const positionStyles: Record<string, string> = {
	top: 'top-0 left-1/2 -translate-x-1/2',
	bottom: 'bottom-0 left-1/2 -translate-x-1/2',
	'top-right': 'top-0 right-0',
	'bottom-right': 'bottom-0 right-0',
};

export function ToastContainer({ position = 'top-right', children, className }: ToastContainerProps) {
	return (
		<T.Provider>
			{children}
			<T.Viewport className={cn(positionStyles[position] ?? positionStyles['top-right'], className)} />
		</T.Provider>
	);
}

export const toastContainerMeta: ComponentMeta = {
	type: 'ToastContainer',
	label: 'Toast Container',
	description: 'Container that manages toast positioning and stacking',
	category: 'feedback',
	propsSchema: z.object({
		position: z.enum(['top', 'bottom', 'top-right', 'bottom-right']).optional(),
	}),
	acceptsChildren: true,
};

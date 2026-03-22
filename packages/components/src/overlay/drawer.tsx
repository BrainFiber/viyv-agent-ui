import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { useOverlay } from './use-overlay.js';

export interface DrawerProps {
	title: string;
	position?: 'left' | 'right';
	width?: number;
	onClose?: () => void;
	children?: ReactNode;
	className?: string;
}

export function Drawer({ title, position = 'right', width = 400, onClose, children, className }: DrawerProps) {
	const { overlayRef, titleId } = useOverlay();

	return (
		<div className="fixed inset-0 z-50 flex">
			<div className="absolute inset-0 bg-overlay" aria-hidden="true" />
			<div
				ref={overlayRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				style={{ width: `${width}px` }}
				className={cn(
					'relative z-10 flex h-full max-w-full flex-col bg-surface shadow-xl focus:outline-none',
					position === 'right' ? 'ml-auto' : 'mr-auto',
					className,
				)}
			>
				<div className="flex items-center justify-between border-b px-6 py-4">
					<h2 id={titleId} className="text-lg font-semibold text-fg">{title}</h2>
					{onClose && (
						<button
							type="button"
							onClick={onClose}
							aria-label="Close"
							className="shrink-0 rounded p-1 text-fg-subtle hover:text-fg-muted"
						>
							&#x2715;
						</button>
					)}
				</div>
				<div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
			</div>
		</div>
	);
}

export const drawerMeta: ComponentMeta = {
	type: 'Drawer',
	label: 'Drawer',
	description: 'Slide-in side panel overlay',
	category: 'layout',
	propsSchema: z.object({
		title: z.string(),
		position: z.enum(['left', 'right']).optional(),
		width: z.number().optional(),
	}),
	acceptsChildren: true,
};

import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { backdropVariants, drawerVariants } from '../lib/motion-presets.js';
import { useOverlay } from './use-overlay.js';

export interface DrawerProps {
	title: string;
	position?: 'left' | 'right';
	width?: number;
	open?: boolean;
	onClose?: () => void;
	children?: ReactNode;
	className?: string;
}

export function Drawer({ title, position = 'right', width = 400, open = true, onClose, children, className }: DrawerProps) {
	const { overlayRef, titleId, unlockScroll } = useOverlay(open);

	return (
		<AnimatePresence onExitComplete={unlockScroll}>
			{open && (
				<motion.div
					className="fixed inset-0 z-50 flex"
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
				>
					<motion.div
						variants={backdropVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="absolute inset-0 bg-overlay backdrop-blur-sm"
						aria-hidden="true"
					/>
					<motion.div
						ref={overlayRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby={titleId}
						tabIndex={-1}
						style={{ width: `${width}px` }}
						variants={drawerVariants[position]}
						initial="hidden"
						animate="visible"
						exit="exit"
						className={cn(
							'relative z-10 flex h-full max-w-full flex-col bg-surface shadow-xl focus:outline-none',
							position === 'right' ? 'ml-auto border-l' : 'mr-auto border-r',
							className,
						)}
					>
						<div className="flex items-center justify-between border-b px-6 py-4">
							<h2 id={titleId} className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
							{onClose && (
								<button
									type="button"
									onClick={onClose}
									aria-label="Close"
									className="shrink-0 rounded p-1 text-fg-subtle transition-colors hover:text-fg-muted"
								>
									&#x2715;
								</button>
							)}
						</div>
						<div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
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
	overlay: true,
};

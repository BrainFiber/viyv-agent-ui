import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { backdropVariants, dialogVariants } from '../lib/motion-presets.js';
import { useOverlay } from './use-overlay.js';

export interface DialogProps {
	title: string;
	open?: boolean;
	children?: ReactNode;
	className?: string;
}

export function Dialog({ title, open = true, children, className }: DialogProps) {
	const { overlayRef, titleId, unlockScroll } = useOverlay(open);

	return (
		<AnimatePresence onExitComplete={unlockScroll}>
			{open && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center"
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
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
						variants={dialogVariants}
						initial="hidden"
						animate="visible"
						exit="exit"
						className={cn('relative z-10 w-[calc(100vw-2rem)] max-w-lg rounded-xl border bg-surface p-6 shadow-xl focus:outline-none', className)}
					>
						<h2 id={titleId} className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
						<div className="mt-4">{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export const dialogMeta: ComponentMeta = {
	type: 'Dialog',
	label: 'Dialog',
	description: 'Modal dialog overlay with title',
	category: 'layout',
	propsSchema: z.object({
		title: z.string(),
	}),
	acceptsChildren: true,
	overlay: true,
};

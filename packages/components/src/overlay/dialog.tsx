import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { useOverlay } from './use-overlay.js';

export interface DialogProps {
	title: string;
	children?: ReactNode;
	className?: string;
}

export function Dialog({ title, children, className }: DialogProps) {
	const { overlayRef, titleId } = useOverlay();

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-overlay" aria-hidden="true" />
			<div
				ref={overlayRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				style={{ maxWidth: '32rem' }}
				className={cn('relative z-10 w-full rounded-lg bg-surface p-6 shadow-xl focus:outline-none', className)}
			>
				<h2 id={titleId} className="text-lg font-semibold text-fg">{title}</h2>
				<div className="mt-4">{children}</div>
			</div>
		</div>
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
};

import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as D from '../ui/dialog.js';
import { cn } from '../lib/cn.js';

export interface DialogProps {
	title: string;
	open?: boolean;
	children?: ReactNode;
	className?: string;
}

export function Dialog({ title, open = true, children, className }: DialogProps) {
	return (
		<D.Root open={open}>
			<D.Portal>
				<D.Overlay />
				<D.Content className={className} aria-describedby={undefined}>
					<D.Title>{title}</D.Title>
					<div className="mt-4">{children}</div>
				</D.Content>
			</D.Portal>
		</D.Root>
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

import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as Drw from '../ui/drawer.js';
import { cn } from '../lib/cn.js';
import { X } from '../lib/icons.js';

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
	return (
		<Drw.Root open={open} onOpenChange={(o) => { if (!o) onClose?.(); }} direction={position}>
			<Drw.Portal>
				<Drw.Overlay />
				<Drw.Content
					aria-describedby={undefined}
					style={{ width: `${width}px` }}
					className={cn(
						position === 'right' ? 'right-0 border-l' : 'left-0 border-r',
						className,
					)}
				>
					<div className="flex items-center justify-between border-b px-6 py-4">
						<Drw.Title className="text-lg font-semibold tracking-tight text-fg">{title}</Drw.Title>
						{onClose && (
							<Drw.Close asChild>
								<button
									type="button"
									aria-label="Close"
									className="shrink-0 rounded p-1 text-fg-subtle transition-colors hover:text-fg-muted"
								>
									<X aria-hidden="true" className="h-4 w-4" />
								</button>
							</Drw.Close>
						)}
					</div>
					<div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
				</Drw.Content>
			</Drw.Portal>
		</Drw.Root>
	);
}

export const drawerMeta: ComponentMeta = {
	type: 'Drawer',
	label: 'Drawer',
	description: 'Slide-in side panel overlay',
	category: 'overlay',
	propsSchema: z.object({
		title: z.string(),
		position: z.enum(['left', 'right']).optional(),
		width: z.number().optional(),
	}),
	acceptsChildren: true,
	overlay: true,
};

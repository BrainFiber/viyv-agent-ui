import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as AD from '../ui/alert-dialog.js';
import { cn } from '../lib/cn.js';

export interface AlertDialogProps {
	title: string;
	description: string;
	confirmLabel?: string;
	cancelLabel?: string;
	open?: boolean;
	onConfirm?: () => void;
	onCancel?: () => void;
	variant?: 'default' | 'destructive';
	children?: ReactNode;
	className?: string;
}

export function AlertDialog({
	title,
	description,
	confirmLabel = 'Continue',
	cancelLabel = 'Cancel',
	open = true,
	onConfirm,
	onCancel,
	variant = 'default',
	children,
	className,
}: AlertDialogProps) {
	return (
		<AD.Root open={open}>
			{children && <AD.Trigger asChild>{children}</AD.Trigger>}
			<AD.Portal>
				<AD.Overlay />
				<AD.Content className={className}>
					<AD.Title>{title}</AD.Title>
					<AD.Description>{description}</AD.Description>
					<div className="mt-6 flex justify-end gap-2">
						<AD.Cancel onClick={onCancel}>{cancelLabel}</AD.Cancel>
						<AD.Action
							onClick={onConfirm}
							className={cn(
								variant === 'destructive' &&
									'bg-danger text-danger-fg hover:bg-danger/90',
							)}
						>
							{confirmLabel}
						</AD.Action>
					</div>
				</AD.Content>
			</AD.Portal>
		</AD.Root>
	);
}

export const alertDialogMeta: ComponentMeta = {
	type: 'AlertDialog',
	label: 'Alert Dialog',
	description: 'Confirmation dialog requiring explicit user action',
	category: 'layout',
	propsSchema: z.object({
		title: z.string(),
		description: z.string(),
		confirmLabel: z.string().optional(),
		cancelLabel: z.string().optional(),
		variant: z.enum(['default', 'destructive']).optional(),
	}),
	acceptsChildren: true,
	overlay: true,
};

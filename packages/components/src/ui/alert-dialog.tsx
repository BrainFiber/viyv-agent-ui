import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = AlertDialogPrimitive.Root;
export const Trigger = AlertDialogPrimitive.Trigger;
export const Portal = AlertDialogPrimitive.Portal;

export const Overlay = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Overlay
		ref={ref}
		className={cn(
			'fixed inset-0 z-50 bg-overlay backdrop-blur-sm',
			'data-[state=open]:animate-[dialog-overlay-in_150ms_ease-out]',
			'data-[state=closed]:animate-[dialog-overlay-out_100ms_ease-in]',
			className,
		)}
		{...props}
	/>
));
Overlay.displayName = 'AlertDialogOverlay';

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AlertDialogPrimitive.Content
		ref={ref}
		className={cn(
			'fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-surface p-6 shadow-xl focus:outline-none',
			'data-[state=open]:animate-[dialog-content-in_200ms_ease-out]',
			'data-[state=closed]:animate-[dialog-content-out_150ms_ease-in]',
			className,
		)}
		{...props}
	>
		{children}
	</AlertDialogPrimitive.Content>
));
Content.displayName = 'AlertDialogContent';

export const Title = forwardRef<
	HTMLHeadingElement,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Title
		ref={ref}
		className={cn('text-lg font-semibold tracking-tight text-fg', className)}
		{...props}
	/>
));
Title.displayName = 'AlertDialogTitle';

export const Description = forwardRef<
	HTMLParagraphElement,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Description
		ref={ref}
		className={cn('mt-2 text-sm text-fg-muted', className)}
		{...props}
	/>
));
Description.displayName = 'AlertDialogDescription';

export const Action = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Action
		ref={ref}
		className={cn(
			'inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-fg shadow-sm transition-colors',
			'hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
			className,
		)}
		{...props}
	/>
));
Action.displayName = 'AlertDialogAction';

export const Cancel = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
	<AlertDialogPrimitive.Cancel
		ref={ref}
		className={cn(
			'inline-flex items-center justify-center rounded-lg border bg-surface px-4 py-2 text-sm font-medium text-fg shadow-sm transition-colors',
			'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
			className,
		)}
		{...props}
	/>
));
Cancel.displayName = 'AlertDialogCancel';

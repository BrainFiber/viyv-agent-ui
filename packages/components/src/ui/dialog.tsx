import * as DialogPrimitive from '@radix-ui/react-dialog';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = DialogPrimitive.Root;
export const Trigger = DialogPrimitive.Trigger;
export const Portal = DialogPrimitive.Portal;
export const Close = DialogPrimitive.Close;

export const Overlay = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
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
Overlay.displayName = 'DialogOverlay';

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DialogPrimitive.Content
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
	</DialogPrimitive.Content>
));
Content.displayName = 'DialogContent';

export const Title = forwardRef<
	HTMLHeadingElement,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn('text-lg font-semibold tracking-tight text-fg', className)}
		{...props}
	/>
));
Title.displayName = 'DialogTitle';

export const Description = DialogPrimitive.Description;

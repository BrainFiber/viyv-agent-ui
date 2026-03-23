import * as ToastPrimitive from '@radix-ui/react-toast';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Provider = ToastPrimitive.Provider;

export const Root = forwardRef<
	HTMLLIElement,
	React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>
>(({ className, ...props }, ref) => (
	<ToastPrimitive.Root
		ref={ref}
		className={cn(
			'group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-xl border p-4 shadow-lg transition-all',
			'data-[state=open]:animate-[toast-slide-in_200ms_ease-out]',
			'data-[state=closed]:animate-[toast-slide-out_150ms_ease-in]',
			'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]',
			'data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
			className,
		)}
		{...props}
	/>
));
Root.displayName = 'ToastRoot';

export const Title = ToastPrimitive.Title;
export const Description = ToastPrimitive.Description;
export const Action = ToastPrimitive.Action;

export const Close = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
	<ToastPrimitive.Close
		ref={ref}
		className={cn('shrink-0 opacity-60 transition-opacity hover:opacity-100', className)}
		{...props}
	/>
));
Close.displayName = 'ToastClose';

export const Viewport = forwardRef<
	HTMLOListElement,
	React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
	<ToastPrimitive.Viewport
		ref={ref}
		className={cn(
			'fixed z-50 flex max-h-screen flex-col-reverse gap-2 p-4 sm:flex-col',
			className,
		)}
		{...props}
	/>
));
Viewport.displayName = 'ToastViewport';

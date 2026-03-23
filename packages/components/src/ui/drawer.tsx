import { Drawer as DrawerPrimitive } from 'vaul';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = DrawerPrimitive.Root;
export const Trigger = DrawerPrimitive.Trigger;
export const Portal = DrawerPrimitive.Portal;
export const Close = DrawerPrimitive.Close;
export const Title = DrawerPrimitive.Title;
export const Description = DrawerPrimitive.Description;

export const Overlay = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DrawerPrimitive.Overlay
		ref={ref}
		className={cn('fixed inset-0 z-50 bg-overlay backdrop-blur-sm animate-[fade-in_150ms_ease-out]', className)}
		{...props}
	/>
));
Overlay.displayName = 'DrawerOverlay';

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<DrawerPrimitive.Content
		ref={ref}
		className={cn('fixed z-50 flex h-full max-w-full flex-col bg-surface shadow-xl focus:outline-none', className)}
		{...props}
	>
		{children}
	</DrawerPrimitive.Content>
));
Content.displayName = 'DrawerContent';

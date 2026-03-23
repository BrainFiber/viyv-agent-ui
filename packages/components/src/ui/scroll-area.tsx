import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
	<ScrollAreaPrimitive.Root
		ref={ref}
		className={cn('relative overflow-hidden', className)}
		{...props}
	>
		<ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
			{children}
		</ScrollAreaPrimitive.Viewport>
		<ScrollBar />
		<Corner />
	</ScrollAreaPrimitive.Root>
));
Root.displayName = 'ScrollAreaRoot';

export const Viewport = ScrollAreaPrimitive.Viewport;

export const ScrollBar = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={cn(
			'flex touch-none select-none transition-colors',
			orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-px',
			orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-px',
			className,
		)}
		{...props}
	>
		<Thumb />
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = 'ScrollAreaScrollBar';

export const Thumb = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaThumb>
>(({ className, ...props }, ref) => (
	<ScrollAreaPrimitive.ScrollAreaThumb
		ref={ref}
		className={cn('relative flex-1 rounded-full bg-border', className)}
		{...props}
	/>
));
Thumb.displayName = 'ScrollAreaThumb';

export const Corner = ScrollAreaPrimitive.Corner;

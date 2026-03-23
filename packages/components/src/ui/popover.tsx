import * as PopoverPrimitive from '@radix-ui/react-popover';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = PopoverPrimitive.Root;
export const Trigger = PopoverPrimitive.Trigger;
export const Anchor = PopoverPrimitive.Anchor;
export const Portal = PopoverPrimitive.Portal;

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'start', sideOffset = 4, ...props }, ref) => (
	<PopoverPrimitive.Portal>
		<PopoverPrimitive.Content
			ref={ref}
			align={align}
			sideOffset={sideOffset}
			className={cn(
				'z-50 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-lg border bg-surface shadow-lg',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				className,
			)}
			{...props}
		/>
	</PopoverPrimitive.Portal>
));
Content.displayName = 'PopoverContent';

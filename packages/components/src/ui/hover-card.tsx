import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = HoverCardPrimitive.Root;
export const Trigger = HoverCardPrimitive.Trigger;
export const Portal = HoverCardPrimitive.Portal;

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
	<HoverCardPrimitive.Portal>
		<HoverCardPrimitive.Content
			ref={ref}
			align={align}
			sideOffset={sideOffset}
			className={cn(
				'z-50 w-64 overflow-hidden rounded-lg border bg-surface p-4 shadow-lg',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				className,
			)}
			{...props}
		/>
	</HoverCardPrimitive.Portal>
));
Content.displayName = 'HoverCardContent';

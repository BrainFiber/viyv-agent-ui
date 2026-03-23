import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Provider = TooltipPrimitive.Provider;
export const Root = TooltipPrimitive.Root;
export const Trigger = TooltipPrimitive.Trigger;
export const Portal = TooltipPrimitive.Portal;

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		sideOffset={sideOffset}
		className={cn(
			'z-50 whitespace-nowrap rounded-md bg-tooltip-bg px-2.5 py-1 text-xs text-tooltip-fg shadow-lg',
			'data-[state=delayed-open]:animate-[tooltip-in_100ms_ease-out]',
			'data-[state=closed]:animate-[tooltip-out_75ms_ease-in]',
			className,
		)}
		{...props}
	/>
));
Content.displayName = 'TooltipContent';

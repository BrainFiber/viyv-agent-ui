import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = CollapsiblePrimitive.Root;
export const Trigger = CollapsiblePrimitive.CollapsibleTrigger;

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => (
	<CollapsiblePrimitive.CollapsibleContent
		ref={ref}
		className={cn(
			'overflow-hidden',
			'data-[state=open]:animate-[accordion-down_250ms_ease-out]',
			'data-[state=closed]:animate-[accordion-up_200ms_ease-in]',
			className,
		)}
		{...props}
	/>
));
Content.displayName = 'CollapsibleContent';

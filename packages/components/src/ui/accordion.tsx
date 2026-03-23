import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';
import { ChevronDown } from '../lib/icons.js';

export const Root = AccordionPrimitive.Root;

export const Item = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
	<AccordionPrimitive.Item ref={ref} className={cn(className)} {...props} />
));
Item.displayName = 'AccordionItem';

export const Trigger = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Header className="flex">
		<AccordionPrimitive.Trigger
			ref={ref}
			className={cn(
				'flex flex-1 items-center justify-between px-4 py-3 text-left text-sm font-medium text-fg transition-colors hover:bg-muted [&[data-state=open]>svg]:rotate-180',
				className,
			)}
			{...props}
		>
			{children}
			<ChevronDown aria-hidden="true" className="ml-2 h-4 w-4 shrink-0 transition-transform duration-200" />
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));
Trigger.displayName = 'AccordionTrigger';

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
	<AccordionPrimitive.Content
		ref={ref}
		className="overflow-hidden data-[state=open]:animate-[accordion-down_250ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-in]"
		{...props}
	>
		<div className={cn('px-4 pb-4 pt-2', className)}>{children}</div>
	</AccordionPrimitive.Content>
));
Content.displayName = 'AccordionContent';

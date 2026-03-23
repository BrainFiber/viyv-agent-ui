import * as TabsPrimitive from '@radix-ui/react-tabs';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = TabsPrimitive.Root;

export const List = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.List
		ref={ref}
		className={cn('flex border-b', className)}
		{...props}
	/>
));
List.displayName = 'TabsList';

export const Trigger = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			'px-4 py-2 text-sm transition-colors text-fg-muted hover:text-fg',
			'data-[state=active]:-mb-px data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:font-medium data-[state=active]:text-primary',
			className,
		)}
		{...props}
	/>
));
Trigger.displayName = 'TabsTrigger';

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
	<TabsPrimitive.Content
		ref={ref}
		className={cn('pt-4 focus-visible:outline-none', className)}
		{...props}
	/>
));
Content.displayName = 'TabsContent';

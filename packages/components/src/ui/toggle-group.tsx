import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
	<ToggleGroupPrimitive.Root
		ref={ref}
		className={cn('flex gap-1', className)}
		{...props}
	/>
));
Root.displayName = 'ToggleGroupRoot';

export const Item = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
	<ToggleGroupPrimitive.Item
		ref={ref}
		className={cn(
			'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
			'hover:bg-muted hover:text-fg',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
			'data-[state=on]:bg-muted data-[state=on]:text-fg',
			'disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
		{...props}
	/>
));
Item.displayName = 'ToggleGroupItem';

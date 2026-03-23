import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
	<RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-2', className)} {...props} />
));
Root.displayName = 'RadioGroupRoot';

export const Item = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
	<RadioGroupPrimitive.Item
		ref={ref}
		className={cn(
			'aspect-square h-4 w-4 rounded-full border border-border-strong shadow-sm transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2',
			'data-[state=checked]:border-primary data-[state=checked]:text-primary',
			'disabled:cursor-not-allowed disabled:opacity-50',
			className,
		)}
		{...props}
	/>
));
Item.displayName = 'RadioGroupItem';

export const Indicator = forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Indicator>
>(({ className, ...props }, ref) => (
	<RadioGroupPrimitive.Indicator
		ref={ref}
		className={cn('flex items-center justify-center', className)}
		{...props}
	>
		<span className="h-2 w-2 rounded-full bg-current" />
	</RadioGroupPrimitive.Indicator>
));
Indicator.displayName = 'RadioGroupIndicator';

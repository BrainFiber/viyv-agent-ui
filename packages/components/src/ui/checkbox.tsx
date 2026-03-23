import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';
import { Check } from '../lib/icons.js';

export const Root = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'peer h-4 w-4 shrink-0 rounded border border-border-strong shadow-sm transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2',
			'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-fg',
			'disabled:cursor-not-allowed disabled:opacity-50',
			className,
		)}
		{...props}
	/>
));
Root.displayName = 'CheckboxRoot';

export const Indicator = forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Indicator
		ref={ref}
		className={cn('flex items-center justify-center text-current', className)}
		{...props}
	>
		<Check className="h-3.5 w-3.5" />
	</CheckboxPrimitive.Indicator>
));
Indicator.displayName = 'CheckboxIndicator';

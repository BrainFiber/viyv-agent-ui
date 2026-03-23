import * as ProgressPrimitive from '@radix-ui/react-progress';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-muted', className)}
		{...props}
	/>
));
Root.displayName = 'ProgressRoot';

export const Indicator = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Indicator>
>(({ className, ...props }, ref) => (
	<ProgressPrimitive.Indicator
		ref={ref}
		className={cn('h-full w-full flex-1 rounded-full bg-primary transition-all duration-500', className)}
		{...props}
	/>
));
Indicator.displayName = 'ProgressIndicator';

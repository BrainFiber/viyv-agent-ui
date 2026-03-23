import * as SwitchPrimitive from '@radix-ui/react-switch';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SwitchPrimitive.Root
		ref={ref}
		className={cn(
			'peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent shadow-sm transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2',
			'data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted-strong',
			'disabled:cursor-not-allowed disabled:opacity-50',
			className,
		)}
		{...props}
	/>
));
Root.displayName = 'SwitchRoot';

export const Thumb = forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Thumb>
>(({ className, ...props }, ref) => (
	<SwitchPrimitive.Thumb
		ref={ref}
		className={cn(
			'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform',
			'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
			className,
		)}
		{...props}
	/>
));
Thumb.displayName = 'SwitchThumb';

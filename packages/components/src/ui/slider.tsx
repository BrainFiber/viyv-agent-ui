import * as SliderPrimitive from '@radix-ui/react-slider';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn('relative flex w-full touch-none select-none items-center', className)}
		{...props}
	/>
));
Root.displayName = 'SliderRoot';

export const Track = forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Track
		ref={ref}
		className={cn('relative h-2 w-full grow overflow-hidden rounded-full bg-muted', className)}
		{...props}
	/>
));
Track.displayName = 'SliderTrack';

export const Range = forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Range
		ref={ref}
		className={cn('absolute h-full bg-primary', className)}
		{...props}
	/>
));
Range.displayName = 'SliderRange';

export const Thumb = forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Thumb
		ref={ref}
		className={cn(
			'block h-5 w-5 rounded-full border-2 border-primary bg-surface shadow-md transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2',
			'disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
		{...props}
	/>
));
Thumb.displayName = 'SliderThumb';

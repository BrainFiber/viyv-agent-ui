import * as TogglePrimitive from '@radix-ui/react-toggle';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
	<TogglePrimitive.Root
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
Root.displayName = 'ToggleRoot';

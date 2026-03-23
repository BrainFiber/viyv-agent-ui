import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';
import { ChevronDown } from '../lib/icons.js';

export const Root = forwardRef<
	HTMLElement,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Root
		ref={ref}
		className={cn('relative z-10 flex max-w-max flex-1 items-center justify-center', className)}
		{...props}
	>
		{children}
		<Viewport />
	</NavigationMenuPrimitive.Root>
));
Root.displayName = 'NavigationMenuRoot';

export const List = forwardRef<
	HTMLUListElement,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.List
		ref={ref}
		className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
		{...props}
	/>
));
List.displayName = 'NavigationMenuList';

export const Item = NavigationMenuPrimitive.Item;

export const Trigger = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Trigger
		ref={ref}
		className={cn(
			'group inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
			'hover:bg-muted hover:text-fg focus:bg-muted focus:text-fg focus:outline-none',
			'data-[state=open]:bg-muted',
			className,
		)}
		{...props}
	>
		{children}
		<ChevronDown
			aria-hidden="true"
			className="ml-1 h-3 w-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
		/>
	</NavigationMenuPrimitive.Trigger>
));
Trigger.displayName = 'NavigationMenuTrigger';

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Content
		ref={ref}
		className={cn(
			'left-0 top-0 w-full md:absolute md:w-auto',
			'data-[motion^=from-]:animate-[fade-in_200ms_ease]',
			'data-[motion^=to-]:animate-[fade-out_200ms_ease]',
			className,
		)}
		{...props}
	/>
));
Content.displayName = 'NavigationMenuContent';

export const Link = NavigationMenuPrimitive.Link;

export const Viewport = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
	<div className="absolute left-0 top-full flex justify-center">
		<NavigationMenuPrimitive.Viewport
			ref={ref}
			className={cn(
				'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-lg border bg-surface shadow-lg md:w-[var(--radix-navigation-menu-viewport-width)]',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				className,
			)}
			{...props}
		/>
	</div>
));
Viewport.displayName = 'NavigationMenuViewport';

export const Indicator = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Indicator
		ref={ref}
		className={cn(
			'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden',
			'data-[state=visible]:animate-[fade-in_100ms_ease-out]',
			'data-[state=hidden]:animate-[fade-out_100ms_ease-in]',
			className,
		)}
		{...props}
	>
		<div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm border bg-surface shadow-md" />
	</NavigationMenuPrimitive.Indicator>
));
Indicator.displayName = 'NavigationMenuIndicator';

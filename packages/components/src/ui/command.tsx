import { Command as CommandPrimitive } from 'cmdk';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';

export const Root = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
	<CommandPrimitive ref={ref} className={cn('flex h-full w-full flex-col', className)} {...props} />
));
Root.displayName = 'CommandRoot';

export const Input = forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Input
		ref={ref}
		className={cn(
			'w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm shadow-sm transition-colors',
			'placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
			'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50',
			className,
		)}
		{...props}
	/>
));
Input.displayName = 'CommandInput';

export const List = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.List
		ref={ref}
		className={cn('max-h-60 overflow-y-auto py-1', className)}
		{...props}
	/>
));
List.displayName = 'CommandList';

export const Empty = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Empty ref={ref} className={cn('py-6 text-center text-sm text-fg-muted', className)} {...props} />
));
Empty.displayName = 'CommandEmpty';

export const Item = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
	<CommandPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 text-sm outline-none',
			'data-[selected=true]:bg-muted data-[selected=true]:text-fg',
			'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
			className,
		)}
		{...props}
	/>
));
Item.displayName = 'CommandItem';

export const Group = CommandPrimitive.Group;

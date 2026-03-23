import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';
import { Check, ChevronRight, Dot } from '../lib/icons.js';

export const Root = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Root
		ref={ref}
		className={cn('flex h-10 items-center gap-1 rounded-lg border bg-surface px-1', className)}
		{...props}
	/>
));
Root.displayName = 'MenubarRoot';

export const Menu: typeof MenubarPrimitive.Menu = MenubarPrimitive.Menu;
export const Portal = MenubarPrimitive.Portal;
export const Group = MenubarPrimitive.Group;
export const RadioGroup = MenubarPrimitive.RadioGroup;
export const Sub = MenubarPrimitive.Sub;

export const Trigger = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Trigger
		ref={ref}
		className={cn(
			'flex cursor-pointer select-none items-center rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-colors',
			'focus:bg-muted data-[state=open]:bg-muted',
			className,
		)}
		{...props}
	/>
));
Trigger.displayName = 'MenubarTrigger';

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(({ className, align = 'start', alignOffset = -4, sideOffset = 8, ...props }, ref) => (
	<MenubarPrimitive.Portal>
		<MenubarPrimitive.Content
			ref={ref}
			align={align}
			alignOffset={alignOffset}
			sideOffset={sideOffset}
			className={cn(
				'z-50 min-w-[12rem] overflow-hidden rounded-lg border bg-surface p-1 shadow-lg',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				className,
			)}
			{...props}
		/>
	</MenubarPrimitive.Portal>
));
Content.displayName = 'MenubarContent';

export const Item = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors',
			'focus:bg-muted focus:text-fg',
			'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		{...props}
	/>
));
Item.displayName = 'MenubarItem';

export const CheckboxItem = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<MenubarPrimitive.CheckboxItem
		ref={ref}
		checked={checked}
		className={cn(
			'relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
			'focus:bg-muted focus:text-fg',
			'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-4 w-4 items-center justify-center">
			<MenubarPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</MenubarPrimitive.ItemIndicator>
		</span>
		{children}
	</MenubarPrimitive.CheckboxItem>
));
CheckboxItem.displayName = 'MenubarCheckboxItem';

export const RadioItem = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<MenubarPrimitive.RadioItem
		ref={ref}
		className={cn(
			'relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
			'focus:bg-muted focus:text-fg',
			'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-4 w-4 items-center justify-center">
			<MenubarPrimitive.ItemIndicator>
				<Dot className="h-4 w-4 fill-current" />
			</MenubarPrimitive.ItemIndicator>
		</span>
		{children}
	</MenubarPrimitive.RadioItem>
));
RadioItem.displayName = 'MenubarRadioItem';

export const Label = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Label
		ref={ref}
		className={cn('px-2 py-1.5 text-xs font-semibold text-fg-muted', className)}
		{...props}
	/>
));
Label.displayName = 'MenubarLabel';

export const Separator = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Separator
		ref={ref}
		className={cn('-mx-1 my-1 h-px bg-border', className)}
		{...props}
	/>
));
Separator.displayName = 'MenubarSeparator';

export const SubTrigger = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
	<MenubarPrimitive.SubTrigger
		ref={ref}
		className={cn(
			'flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors',
			'focus:bg-muted data-[state=open]:bg-muted',
			className,
		)}
		{...props}
	>
		{children}
		<ChevronRight className="ml-auto h-4 w-4" />
	</MenubarPrimitive.SubTrigger>
));
SubTrigger.displayName = 'MenubarSubTrigger';

export const SubContent = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<MenubarPrimitive.Portal>
		<MenubarPrimitive.SubContent
			ref={ref}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-surface p-1 shadow-lg',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				className,
			)}
			{...props}
		/>
	</MenubarPrimitive.Portal>
));
SubContent.displayName = 'MenubarSubContent';

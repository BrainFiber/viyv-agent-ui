import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';
import { Check, ChevronRight, Dot } from '../lib/icons.js';

export const Root = ContextMenuPrimitive.Root;
export const Trigger = ContextMenuPrimitive.Trigger;
export const Portal = ContextMenuPrimitive.Portal;
export const Group = ContextMenuPrimitive.Group;
export const RadioGroup = ContextMenuPrimitive.RadioGroup;
export const Sub = ContextMenuPrimitive.Sub;

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
	<ContextMenuPrimitive.Portal>
		<ContextMenuPrimitive.Content
			ref={ref}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-surface p-1 shadow-lg',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				className,
			)}
			{...props}
		/>
	</ContextMenuPrimitive.Portal>
));
Content.displayName = 'ContextMenuContent';

export const Item = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
	<ContextMenuPrimitive.Item
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
Item.displayName = 'ContextMenuItem';

export const CheckboxItem = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<ContextMenuPrimitive.CheckboxItem
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
			<ContextMenuPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</ContextMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</ContextMenuPrimitive.CheckboxItem>
));
CheckboxItem.displayName = 'ContextMenuCheckboxItem';

export const RadioItem = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<ContextMenuPrimitive.RadioItem
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
			<ContextMenuPrimitive.ItemIndicator>
				<Dot className="h-4 w-4 fill-current" />
			</ContextMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</ContextMenuPrimitive.RadioItem>
));
RadioItem.displayName = 'ContextMenuRadioItem';

export const Label = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
	<ContextMenuPrimitive.Label
		ref={ref}
		className={cn('px-2 py-1.5 text-xs font-semibold text-fg-muted', className)}
		{...props}
	/>
));
Label.displayName = 'ContextMenuLabel';

export const Separator = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<ContextMenuPrimitive.Separator
		ref={ref}
		className={cn('-mx-1 my-1 h-px bg-border', className)}
		{...props}
	/>
));
Separator.displayName = 'ContextMenuSeparator';

export const SubTrigger = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
	<ContextMenuPrimitive.SubTrigger
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
	</ContextMenuPrimitive.SubTrigger>
));
SubTrigger.displayName = 'ContextMenuSubTrigger';

export const SubContent = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<ContextMenuPrimitive.Portal>
		<ContextMenuPrimitive.SubContent
			ref={ref}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-surface p-1 shadow-lg',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				className,
			)}
			{...props}
		/>
	</ContextMenuPrimitive.Portal>
));
SubContent.displayName = 'ContextMenuSubContent';

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';
import { Check, ChevronRight, Dot } from '../lib/icons.js';

export const Root = DropdownMenuPrimitive.Root;
export const Trigger = DropdownMenuPrimitive.Trigger;
export const Portal = DropdownMenuPrimitive.Portal;
export const Group = DropdownMenuPrimitive.Group;
export const RadioGroup = DropdownMenuPrimitive.RadioGroup;
export const Sub = DropdownMenuPrimitive.Sub;

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-surface p-1 shadow-lg',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				className,
			)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));
Content.displayName = 'DropdownMenuContent';

export const Item = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
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
Item.displayName = 'DropdownMenuItem';

export const CheckboxItem = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
	<DropdownMenuPrimitive.CheckboxItem
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
			<DropdownMenuPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.CheckboxItem>
));
CheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const RadioItem = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
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
			<DropdownMenuPrimitive.ItemIndicator>
				<Dot className="h-4 w-4 fill-current" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));
RadioItem.displayName = 'DropdownMenuRadioItem';

export const Label = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={cn('px-2 py-1.5 text-xs font-semibold text-fg-muted', className)}
		{...props}
	/>
));
Label.displayName = 'DropdownMenuLabel';

export const Separator = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		className={cn('-mx-1 my-1 h-px bg-border', className)}
		{...props}
	/>
));
Separator.displayName = 'DropdownMenuSeparator';

export const SubTrigger = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>
>(({ className, children, ...props }, ref) => (
	<DropdownMenuPrimitive.SubTrigger
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
	</DropdownMenuPrimitive.SubTrigger>
));
SubTrigger.displayName = 'DropdownMenuSubTrigger';

export const SubContent = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.SubContent
			ref={ref}
			className={cn(
				'z-50 min-w-[8rem] overflow-hidden rounded-lg border bg-surface p-1 shadow-lg',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				className,
			)}
			{...props}
		/>
	</DropdownMenuPrimitive.Portal>
));
SubContent.displayName = 'DropdownMenuSubContent';

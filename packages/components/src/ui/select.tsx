import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef } from 'react';
import { cn } from '../lib/cn.js';
import { ChevronDown, Check } from '../lib/icons.js';

export const Root = SelectPrimitive.Root;
export const Value = SelectPrimitive.Value;
export const Group = SelectPrimitive.Group;

export const Trigger = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={cn(
			'flex w-full items-center justify-between rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm shadow-sm transition-colors',
			'placeholder:text-fg-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30',
			'disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50',
			className,
		)}
		{...props}
	>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className="h-4 w-4 opacity-50" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
Trigger.displayName = 'SelectTrigger';

export const Content = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			position={position}
			className={cn(
				'relative z-50 max-h-60 min-w-[8rem] overflow-hidden rounded-lg border bg-surface shadow-lg',
				'data-[state=open]:animate-[fade-in_150ms_ease-out]',
				'data-[state=closed]:animate-[fade-out_100ms_ease-in]',
				position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
				className,
			)}
			{...props}
		>
			<SelectPrimitive.Viewport
				className={cn(
					'p-1',
					position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
				)}
			>
				{children}
			</SelectPrimitive.Viewport>
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));
Content.displayName = 'SelectContent';

export const Item = forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none',
			'focus:bg-muted focus:text-fg',
			'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
			className,
		)}
		{...props}
	>
		<span className="absolute left-2 flex h-4 w-4 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check className="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
Item.displayName = 'SelectItem';

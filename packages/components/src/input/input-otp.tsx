import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { OTPInput, type SlotProps } from 'input-otp';
import { cn } from '../lib/cn.js';

export interface InputOTPProps {
	length?: number;
	value?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
	className?: string;
}

function Slot({ char, isActive, hasFakeCaret }: SlotProps) {
	return (
		<div
			className={cn(
				'relative flex h-10 w-10 items-center justify-center border-y border-r border-border-strong text-sm transition-all first:rounded-l-lg first:border-l last:rounded-r-lg',
				isActive && 'z-10 ring-2 ring-ring/30',
			)}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="h-4 w-px animate-pulse bg-fg" />
				</div>
			)}
		</div>
	);
}

export function InputOTP({
	length = 6,
	value,
	onChange,
	disabled,
	className,
}: InputOTPProps) {
	return (
		<OTPInput
			maxLength={length}
			value={value}
			onChange={onChange}
			disabled={disabled}
			containerClassName={cn('flex items-center', className)}
			render={({ slots }) => (
				<div className="flex items-center">
					{slots.map((slot, i) => (
						<Slot key={i} {...slot} />
					))}
				</div>
			)}
		/>
	);
}

export const inputOTPMeta: ComponentMeta = {
	type: 'InputOTP',
	label: 'OTP Input',
	description: 'One-time password input with individual character slots',
	category: 'input',
	propsSchema: z.object({
		length: z.number().min(1).max(10).default(6),
		value: z.string().optional(),
		disabled: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

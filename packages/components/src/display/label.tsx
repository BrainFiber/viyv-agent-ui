import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface LabelProps {
	text: string;
	htmlFor?: string;
	required?: boolean;
	className?: string;
}

export function Label({ text, htmlFor, required, className }: LabelProps) {
	return (
		<label
			htmlFor={htmlFor}
			className={cn(
				'text-sm font-medium leading-none text-fg peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
				className,
			)}
		>
			{text}
			{required && (
				<span className="ml-0.5 text-danger" aria-hidden="true">
					*
				</span>
			)}
		</label>
	);
}

export const labelMeta: ComponentMeta = {
	type: 'Label',
	label: 'Label',
	description: 'Text label for form controls',
	category: 'display',
	propsSchema: z.object({
		text: z.string(),
		htmlFor: z.string().optional(),
		required: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

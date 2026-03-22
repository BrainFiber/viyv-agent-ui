import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface LinkProps {
	href: string;
	label: string;
	external?: boolean;
	className?: string;
}

export function Link({ href, label, external, className }: LinkProps) {
	return (
		<a
			href={href}
			className={cn('text-primary underline underline-offset-2 hover:text-primary-hover', className)}
			{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
		>
			{label}
		</a>
	);
}

export const linkMeta: ComponentMeta = {
	type: 'Link',
	label: 'Link',
	description: 'Text hyperlink',
	category: 'display',
	propsSchema: z.object({
		href: z.string(),
		label: z.string(),
		external: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

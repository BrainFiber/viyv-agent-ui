import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface CardProps {
	title?: string;
	description?: string;
	children?: ReactNode;
	className?: string;
}

export function Card({ title, description, children, className }: CardProps) {
	return (
		<div className={cn('rounded-lg border bg-white p-6 shadow-sm', className)}>
			{title && (
				<div className="mb-4">
					<h3 className="text-lg font-semibold">{title}</h3>
					{description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
				</div>
			)}
			{children}
		</div>
	);
}

export const cardMeta: ComponentMeta = {
	type: 'Card',
	label: 'Card',
	description: 'Container card with optional title',
	category: 'layout',
	propsSchema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
	}),
	acceptsChildren: true,
};

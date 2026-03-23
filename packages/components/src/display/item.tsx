import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface ItemProps {
	title: string;
	description?: string;
	media?: string;
	href?: string;
	className?: string;
}

export function Item({ title, description, media, href, className }: ItemProps) {
	const content = (
		<div className={cn('flex items-center gap-3 rounded-lg p-3', href && 'hover:bg-muted transition-colors', className)}>
			{media && (
				<div className="shrink-0">
					<img
						src={media}
						alt={title}
						className="h-12 w-12 rounded-lg object-cover"
					/>
				</div>
			)}
			<div className="min-w-0 flex-1">
				<p className="text-sm font-medium text-fg truncate">{title}</p>
				{description && (
					<p className="text-sm text-fg-muted truncate">{description}</p>
				)}
			</div>
		</div>
	);

	if (href) {
		return (
			<a href={href} className="block no-underline">
				{content}
			</a>
		);
	}

	return content;
}

export const itemMeta: ComponentMeta = {
	type: 'Item',
	label: 'Item',
	description: 'Horizontal layout with media and text content',
	category: 'display',
	propsSchema: z.object({
		title: z.string(),
		description: z.string().optional(),
		media: z.string().optional(),
		href: z.string().optional(),
	}),
	acceptsChildren: false,
};

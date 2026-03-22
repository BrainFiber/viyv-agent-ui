import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface BreadcrumbsProps {
	items: Array<{ label: string; href?: string }>;
	separator?: string;
	className?: string;
}

export function Breadcrumbs({ items, separator = '/', className }: BreadcrumbsProps) {
	if (items.length === 0) return null;
	return (
		<nav aria-label="Breadcrumb" className={cn(className)}>
			<ol className="flex items-center gap-1 text-sm text-fg-muted">
				{items.map((item, i) => {
					const isLast = i === items.length - 1;
					return (
						<li key={i} className="flex items-center gap-1">
							{i > 0 && <span aria-hidden="true" className="text-fg-subtle">{separator}</span>}
							{isLast || !item.href ? (
								<span aria-current={isLast ? 'page' : undefined} className={cn(isLast && 'font-medium text-fg')}>
									{item.label}
								</span>
							) : (
								<a href={item.href} className="hover:text-fg hover:underline">{item.label}</a>
							)}
						</li>
					);
				})}
			</ol>
		</nav>
	);
}

export const breadcrumbsMeta: ComponentMeta = {
	type: 'Breadcrumbs',
	label: 'Breadcrumbs',
	description: 'Hierarchical path navigation',
	category: 'navigation',
	propsSchema: z.object({
		items: z.array(z.object({ label: z.string(), href: z.string().optional() })),
		separator: z.string().optional(),
	}),
	acceptsChildren: false,
};

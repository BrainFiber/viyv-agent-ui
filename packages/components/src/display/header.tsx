import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface HeaderProps {
	title: string;
	subtitle?: string;
	level?: 1 | 2 | 3;
	className?: string;
}

const headingStyles = {
	1: 'text-3xl font-bold',
	2: 'text-2xl font-semibold',
	3: 'text-xl font-medium',
};

export function Header({ title, subtitle, level = 1, className }: HeaderProps) {
	const Tag = `h${level}` as const;

	return (
		<div className={cn('space-y-1', className)}>
			<Tag className={headingStyles[level]}>{title}</Tag>
			{subtitle && <p className="text-fg-muted">{subtitle}</p>}
		</div>
	);
}

export const headerMeta: ComponentMeta = {
	type: 'Header',
	label: 'Header',
	description: 'Page or section header',
	category: 'display',
	propsSchema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		level: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
	}),
	acceptsChildren: false,
};

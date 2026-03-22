import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { Inbox, Search, TriangleAlert, Folder } from '../lib/icons.js';

export interface EmptyProps {
	title?: string;
	description?: string;
	icon?: 'inbox' | 'search' | 'error' | 'folder';
	className?: string;
}

const icons: Record<string, React.ReactNode> = {
	inbox: <Inbox aria-hidden="true" className="mx-auto h-16 w-16 text-fg-disabled" strokeWidth={1.5} />,
	search: <Search aria-hidden="true" className="mx-auto h-16 w-16 text-fg-disabled" strokeWidth={1.5} />,
	error: <TriangleAlert aria-hidden="true" className="mx-auto h-16 w-16 text-fg-disabled" strokeWidth={1.5} />,
	folder: <Folder aria-hidden="true" className="mx-auto h-16 w-16 text-fg-disabled" strokeWidth={1.5} />,
};

export function Empty({ title = 'データがありません', description, icon = 'inbox', className }: EmptyProps) {
	return (
		<div
			className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
			aria-label={title}
		>
			{icons[icon] ?? icons.inbox}
			<h3 className="mt-4 text-base font-medium text-fg">{title}</h3>
			{description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
		</div>
	);
}

export const emptyMeta: ComponentMeta = {
	type: 'Empty',
	label: 'Empty',
	description: 'Empty state placeholder',
	category: 'display',
	propsSchema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		icon: z.enum(['inbox', 'search', 'error', 'folder']).optional(),
	}),
	acceptsChildren: false,
};

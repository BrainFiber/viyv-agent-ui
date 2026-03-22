import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface EmptyProps {
	title?: string;
	description?: string;
	icon?: 'inbox' | 'search' | 'error' | 'folder';
	className?: string;
}

const icons: Record<string, React.ReactNode> = {
	inbox: (
		<svg aria-hidden="true" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3" />
		</svg>
	),
	search: (
		<svg aria-hidden="true" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
		</svg>
	),
	error: (
		<svg aria-hidden="true" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
		</svg>
	),
	folder: (
		<svg aria-hidden="true" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
		</svg>
	),
};

export function Empty({ title = 'データがありません', description, icon = 'inbox', className }: EmptyProps) {
	return (
		<div
			className={cn('flex flex-col items-center justify-center py-12 text-center', className)}
			aria-label={title}
		>
			{icons[icon] ?? icons.inbox}
			<h3 className="mt-4 text-sm font-medium text-gray-900">{title}</h3>
			{description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
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

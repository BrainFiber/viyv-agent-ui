import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import { normalizeData } from '../lib/normalize-data.js';

export interface ListProps {
	data: unknown;
	labelKey?: string;
	secondaryKey?: string;
	avatarKey?: string;
	hrefKey?: string;
	ordered?: boolean;
	divider?: boolean;
	emptyMessage?: string;
	className?: string;
}

function getField(item: unknown, key: string): string {
	if (item && typeof item === 'object' && key in item) {
		return String((item as Record<string, unknown>)[key] ?? '');
	}
	return '';
}

function getInitial(name: string): string {
	return name.trim().charAt(0).toUpperCase();
}

export function List({
	data,
	labelKey = 'label',
	secondaryKey,
	avatarKey,
	hrefKey,
	ordered,
	divider = true,
	emptyMessage = 'データがありません',
	className,
}: ListProps) {
	const items = normalizeData(data, 'List');
	if (items.length === 0) {
		return <p className={cn('py-8 text-center text-sm text-fg-muted', className)}>{emptyMessage}</p>;
	}

	const Tag = ordered ? 'ol' : 'ul';

	return (
		<Tag role="list" className={cn(divider && 'divide-y', className)}>
			{items.map((item, i) => {
				const label = getField(item, labelKey);
				const secondary = secondaryKey ? getField(item, secondaryKey) : undefined;
				const avatar = avatarKey ? getField(item, avatarKey) : undefined;
				const href = hrefKey ? getField(item, hrefKey) : undefined;

				const content = (
					<div className="flex items-center gap-3 px-2 py-3">
						{avatar !== undefined && (
							<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted-strong text-xs font-medium text-fg-muted">
								{getInitial(avatar || label)}
							</span>
						)}
						<div className="min-w-0 flex-1">
							<p className="text-sm font-medium text-fg truncate">{label}</p>
							{secondary && <p className="text-xs text-fg-muted truncate">{secondary}</p>}
						</div>
					</div>
				);

				return (
					<li key={label || i} role="listitem" aria-label={label}>
						{href ? (
							<a href={href} className="block transition-colors hover:bg-muted/50">{content}</a>
						) : (
							content
						)}
					</li>
				);
			})}
		</Tag>
	);
}

export const listMeta: ComponentMeta = {
	type: 'List',
	label: 'List',
	description: 'Simple data list display',
	category: 'data',
	propsSchema: z.object({
		data: z.unknown(),
		labelKey: z.string().optional(),
		secondaryKey: z.string().optional(),
		avatarKey: z.string().optional(),
		hrefKey: z.string().optional(),
		ordered: z.boolean().optional(),
		divider: z.boolean().optional(),
		emptyMessage: z.string().optional(),
	}),
	acceptsChildren: false,
};

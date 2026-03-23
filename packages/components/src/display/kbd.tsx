import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface KbdProps {
	keys: string | string[];
	className?: string;
}

export function Kbd({ keys, className }: KbdProps) {
	const keyList = Array.isArray(keys) ? keys : [keys];
	return (
		<span className={cn('inline-flex items-center gap-0.5', className)}>
			{keyList.map((key, i) => (
				<span key={i}>
					{i > 0 && (
						<span className="mx-0.5 text-xs text-fg-tertiary">+</span>
					)}
					<kbd
						className={cn(
							'inline-flex h-5 min-w-5 items-center justify-center rounded border border-border-strong bg-muted px-1.5',
							'font-mono text-[11px] font-medium text-fg-secondary shadow-sm',
						)}
					>
						{key}
					</kbd>
				</span>
			))}
		</span>
	);
}

export const kbdMeta: ComponentMeta = {
	type: 'Kbd',
	label: 'Keyboard Shortcut',
	description: 'Displays keyboard shortcut badges',
	category: 'display',
	propsSchema: z.object({
		keys: z.union([z.string(), z.array(z.string())]),
	}),
	acceptsChildren: false,
};

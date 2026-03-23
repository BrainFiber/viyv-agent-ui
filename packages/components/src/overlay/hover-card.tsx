import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as HC from '../ui/hover-card.js';
import { cn } from '../lib/cn.js';

export interface HoverCardProps {
	content?: string;
	children?: ReactNode;
	className?: string;
}

export function HoverCard({ content, children, className }: HoverCardProps) {
	return (
		<HC.Root>
			<HC.Trigger asChild>
				<span className="inline-block cursor-pointer underline decoration-dotted underline-offset-4">
					{children}
				</span>
			</HC.Trigger>
			<HC.Content className={cn(className)}>
				{content && <p className="text-sm text-fg-secondary">{content}</p>}
			</HC.Content>
		</HC.Root>
	);
}

export const hoverCardMeta: ComponentMeta = {
	type: 'HoverCard',
	label: 'Hover Card',
	description: 'Card popup displayed on hover',
	category: 'overlay',
	propsSchema: z.object({
		content: z.string().optional(),
	}),
	acceptsChildren: true,
};

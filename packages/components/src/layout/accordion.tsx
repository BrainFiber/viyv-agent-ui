import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { Children } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import * as Acc from '../ui/accordion.js';

export interface AccordionProps {
	panels: Array<{ id: string; title: string }>;
	accordion?: boolean;
	defaultOpen?: string[];
	children?: ReactNode;
	className?: string;
}

export function Accordion({ panels, accordion, defaultOpen, children, className }: AccordionProps) {
	const childArray = Children.toArray(children);

	if (accordion) {
		return (
			<Acc.Root
				type="single"
				collapsible
				defaultValue={defaultOpen?.[0]}
				className={cn('divide-y rounded-xl border', className)}
			>
				{panels.map((panel, i) => (
					<Acc.Item key={panel.id} value={panel.id}>
						<Acc.Trigger>{panel.title}</Acc.Trigger>
						<Acc.Content>{childArray[i] ?? null}</Acc.Content>
					</Acc.Item>
				))}
			</Acc.Root>
		);
	}

	return (
		<Acc.Root
			type="multiple"
			defaultValue={defaultOpen}
			className={cn('divide-y rounded-xl border', className)}
		>
			{panels.map((panel, i) => (
				<Acc.Item key={panel.id} value={panel.id}>
					<Acc.Trigger>{panel.title}</Acc.Trigger>
					<Acc.Content>{childArray[i] ?? null}</Acc.Content>
				</Acc.Item>
			))}
		</Acc.Root>
	);
}

export const accordionMeta: ComponentMeta = {
	type: 'Accordion',
	label: 'Accordion',
	description: 'Expandable/collapsible accordion panels',
	category: 'layout',
	propsSchema: z.object({
		panels: z.array(z.object({ id: z.string(), title: z.string() })),
		accordion: z.boolean().optional(),
		defaultOpen: z.array(z.string()).optional(),
	}),
	acceptsChildren: true,
};

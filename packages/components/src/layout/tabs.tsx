import { z } from 'zod';
import { Children } from 'react';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import * as TabsUI from '../ui/tabs.js';

export interface TabsProps {
	tabs: Array<{ id: string; label: string }>;
	children?: ReactNode;
	className?: string;
}

export function Tabs({ tabs, children, className }: TabsProps) {
	const childArray = Children.toArray(children);
	return (
		<TabsUI.Root defaultValue={tabs[0]?.id} className={className}>
			<TabsUI.List>
				{tabs.map((tab) => (
					<TabsUI.Trigger key={tab.id} value={tab.id}>
						{tab.label}
					</TabsUI.Trigger>
				))}
			</TabsUI.List>
			{tabs.map((tab, i) => (
				<TabsUI.Content key={tab.id} value={tab.id}>
					{childArray[i] ?? null}
				</TabsUI.Content>
			))}
		</TabsUI.Root>
	);
}

export const tabsMeta: ComponentMeta = {
	type: 'Tabs',
	label: 'Tabs',
	description: 'Tabbed content switcher',
	category: 'layout',
	propsSchema: z.object({
		tabs: z.array(z.object({ id: z.string(), label: z.string() })),
	}),
	acceptsChildren: true,
};

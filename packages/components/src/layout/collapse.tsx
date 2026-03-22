import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, Children, useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface CollapseProps {
	panels: Array<{ id: string; title: string }>;
	accordion?: boolean;
	defaultOpen?: string[];
	children?: ReactNode;
	className?: string;
}

export function Collapse({ panels, accordion, defaultOpen, children, className }: CollapseProps) {
	const [openPanels, setOpenPanels] = useState<Set<string>>(new Set(defaultOpen ?? []));
	const childArray = Children.toArray(children);
	const instanceId = useId();

	const toggle = (id: string) => {
		setOpenPanels((prev) => {
			const next = new Set(accordion ? [] : prev);
			if (prev.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	return (
		<div className={cn('divide-y rounded-lg border', className)}>
			{panels.map((panel, i) => {
				const isOpen = openPanels.has(panel.id);
				const headerId = `${instanceId}-header-${panel.id}`;
				const regionId = `${instanceId}-region-${panel.id}`;
				return (
					<div key={panel.id}>
						<button
							id={headerId}
							type="button"
							aria-expanded={isOpen}
							aria-controls={regionId}
							onClick={() => toggle(panel.id)}
							className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 hover:bg-gray-50"
						>
							{panel.title}
							<span className={cn('ml-2 transition-transform', isOpen && 'rotate-180')}>&#x25BE;</span>
						</button>
						{isOpen && (
							<div
								id={regionId}
								role="region"
								aria-labelledby={headerId}
								className="px-4 pb-4 pt-2"
							>
								{childArray[i] ?? null}
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}

export const collapseMeta: ComponentMeta = {
	type: 'Collapse',
	label: 'Collapse',
	description: 'Expandable/collapsible accordion panels',
	category: 'layout',
	propsSchema: z.object({
		panels: z.array(z.object({ id: z.string(), title: z.string() })),
		accordion: z.boolean().optional(),
		defaultOpen: z.array(z.string()).optional(),
	}),
	acceptsChildren: true,
};

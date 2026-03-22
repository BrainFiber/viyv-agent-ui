import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, Children, useId } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { ChevronDown } from '../lib/icons.js';
import { collapseVariants } from '../lib/motion-presets.js';

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
		<div className={cn('divide-y rounded-xl border', className)}>
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
							className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-fg transition-colors hover:bg-muted"
						>
							{panel.title}
							<ChevronDown aria-hidden="true" className={cn('ml-2 h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
						</button>
						<AnimatePresence initial={false}>
							{isOpen && (
								<motion.div
									id={regionId}
									role="region"
									aria-labelledby={headerId}
									variants={collapseVariants}
									initial="hidden"
									animate="visible"
									exit="exit"
									style={{ overflow: 'hidden' }}
								>
									<div className="px-4 pb-4 pt-2">
										{childArray[i] ?? null}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
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

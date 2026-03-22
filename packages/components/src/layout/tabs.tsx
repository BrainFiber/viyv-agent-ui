import { z } from 'zod';
import { useState, Children, useId } from 'react';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/cn.js';
import { fadeVariants } from '../lib/motion-presets.js';

export interface TabsProps {
	tabs: Array<{ id: string; label: string }>;
	children?: ReactNode;
	className?: string;
}

export function Tabs({ tabs, children, className }: TabsProps) {
	const [activeIndex, setActiveIndex] = useState(0);
	const childArray = Children.toArray(children);
	const instanceId = useId();

	return (
		<div className={cn(className)}>
			<div className="flex border-b" role="tablist">
				{tabs.map((tab, i) => (
					<button
						key={tab.id}
						id={`${instanceId}-tab-${tab.id}`}
						role="tab"
						aria-selected={i === activeIndex}
						className={cn(
							'px-4 py-2 text-sm transition-colors',
							i === activeIndex
								? '-mb-px border-b-2 border-primary font-medium text-primary'
								: 'text-fg-muted hover:text-fg',
						)}
						onClick={() => setActiveIndex(i)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<AnimatePresence mode="wait">
				<motion.div
					key={activeIndex}
					className="pt-4"
					role="tabpanel"
					aria-labelledby={`${instanceId}-tab-${tabs[activeIndex].id}`}
					variants={fadeVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
				>
					{childArray[activeIndex] ?? null}
				</motion.div>
			</AnimatePresence>
		</div>
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

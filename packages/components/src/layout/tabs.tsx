import { useState, Children, useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

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
								? 'border-b-2 border-blue-500 font-medium text-blue-600'
								: 'text-gray-500 hover:text-gray-700',
						)}
						onClick={() => setActiveIndex(i)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="pt-4" role="tabpanel" aria-labelledby={`${instanceId}-tab-${tabs[activeIndex].id}`}>
				{childArray[activeIndex] ?? null}
			</div>
		</div>
	);
}

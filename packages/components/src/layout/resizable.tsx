import { z } from 'zod';
import { Children, Fragment } from 'react';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { Group, Panel, Separator } from 'react-resizable-panels';
import { cn } from '../lib/cn.js';

export interface ResizableProps {
	direction?: 'horizontal' | 'vertical';
	sizes?: number[];
	children?: ReactNode;
	className?: string;
}

export function Resizable({ direction = 'horizontal', sizes, children, className }: ResizableProps) {
	const childArray = Children.toArray(children);

	return (
		<Group orientation={direction} className={cn('rounded-lg border', className)}>
			{childArray.map((child, i) => {
				const defaultSize = sizes?.[i] ?? Math.floor(100 / childArray.length);
				return (
					<Fragment key={i}>
						{i > 0 && (
							<Separator
								className={cn(
									'relative flex items-center justify-center bg-border transition-colors hover:bg-primary/20',
									direction === 'horizontal' ? 'w-px' : 'h-px',
									'after:absolute after:rounded-full after:bg-border',
									direction === 'horizontal'
										? 'after:h-4 after:w-1'
										: 'after:h-1 after:w-4',
								)}
							/>
						)}
						<Panel defaultSize={defaultSize} className="overflow-auto">
							{child}
						</Panel>
					</Fragment>
				);
			})}
		</Group>
	);
}

export const resizableMeta: ComponentMeta = {
	type: 'Resizable',
	label: 'Resizable',
	description: 'Resizable panel layout with draggable handles',
	category: 'layout',
	propsSchema: z.object({
		direction: z.enum(['horizontal', 'vertical']).default('horizontal'),
		sizes: z.array(z.number()).optional(),
	}),
	acceptsChildren: true,
};

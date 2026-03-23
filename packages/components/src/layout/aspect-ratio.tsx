import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';
import * as AspectRatioUI from '../ui/aspect-ratio.js';

export interface AspectRatioProps {
	ratio?: number;
	children?: ReactNode;
	className?: string;
}

export function AspectRatio({ ratio = 16 / 9, children, className }: AspectRatioProps) {
	return (
		<div className={cn('overflow-hidden rounded-lg', className)}>
			<AspectRatioUI.Root ratio={ratio}>
				{children}
			</AspectRatioUI.Root>
		</div>
	);
}

export const aspectRatioMeta: ComponentMeta = {
	type: 'AspectRatio',
	label: 'Aspect Ratio',
	description: 'Container that maintains a fixed aspect ratio',
	category: 'layout',
	propsSchema: z.object({
		ratio: z.number().default(16 / 9),
	}),
	acceptsChildren: true,
};

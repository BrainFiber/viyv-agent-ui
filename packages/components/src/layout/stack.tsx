import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface StackProps {
	direction?: 'vertical' | 'horizontal';
	gap?: number;
	children?: ReactNode;
	className?: string;
}

export function Stack({ direction = 'vertical', gap = 16, children, className }: StackProps) {
	return (
		<div
			className={cn('flex', direction === 'vertical' ? 'flex-col' : 'flex-row', className)}
			style={{ gap: `${gap}px` }}
		>
			{children}
		</div>
	);
}

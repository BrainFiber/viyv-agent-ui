import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface GridProps {
	columns?: number;
	gap?: number;
	children?: ReactNode;
	className?: string;
}

export function Grid({ columns = 2, gap = 16, children, className }: GridProps) {
	return (
		<div
			className={cn('grid', className)}
			style={{
				gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
				gap: `${gap}px`,
			}}
		>
			{children}
		</div>
	);
}

import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface StackProps {
	direction?: 'vertical' | 'horizontal';
	gap?: number;
	align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
	justify?: 'start' | 'center' | 'end' | 'between' | 'around';
	wrap?: boolean;
	children?: ReactNode;
	className?: string;
}

const alignMap: Record<string, string> = {
	start: 'items-start',
	center: 'items-center',
	end: 'items-end',
	stretch: 'items-stretch',
	baseline: 'items-baseline',
};

const justifyMap: Record<string, string> = {
	start: 'justify-start',
	center: 'justify-center',
	end: 'justify-end',
	between: 'justify-between',
	around: 'justify-around',
};

export function Stack({
	direction = 'vertical',
	gap = 16,
	align,
	justify,
	wrap,
	children,
	className,
}: StackProps) {
	return (
		<div
			className={cn(
				'flex',
				direction === 'vertical' ? 'flex-col' : 'flex-row',
				align && alignMap[align],
				justify && justifyMap[justify],
				wrap && 'flex-wrap',
				className,
			)}
			style={{ gap: `${gap}px` }}
		>
			{children}
		</div>
	);
}

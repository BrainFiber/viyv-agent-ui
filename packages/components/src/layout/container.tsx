import { z } from 'zod';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import type { CSSProperties } from 'react';
import { cn } from '../lib/cn.js';

export interface ContainerProps {
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
	center?: boolean;
	p?: number;
	px?: number;
	py?: number;
	children?: ReactNode;
	className?: string;
}

const MAX_WIDTH_MAP: Record<string, string> = {
	sm: '640px',
	md: '768px',
	lg: '1024px',
	xl: '1280px',
	'2xl': '1536px',
	full: '100%',
};

export function Container({
	maxWidth = 'lg',
	center = true,
	p,
	px,
	py,
	children,
	className,
}: ContainerProps) {
	const style: CSSProperties = {};
	style.maxWidth = MAX_WIDTH_MAP[maxWidth] ?? MAX_WIDTH_MAP.lg;
	style.width = '100%';
	if (center) {
		style.marginLeft = 'auto';
		style.marginRight = 'auto';
	}
	if (p != null) style.padding = `${p}px`;
	if (px != null) {
		style.paddingLeft = `${px}px`;
		style.paddingRight = `${px}px`;
	}
	if (py != null) {
		style.paddingTop = `${py}px`;
		style.paddingBottom = `${py}px`;
	}

	return (
		<div className={cn(className)} style={style}>
			{children}
		</div>
	);
}

export const containerMeta: ComponentMeta = {
	type: 'Container',
	label: 'Container',
	description: 'Centered max-width page container',
	category: 'layout',
	propsSchema: z.object({
		maxWidth: z.enum(['sm', 'md', 'lg', 'xl', '2xl', 'full']).optional(),
		center: z.boolean().optional(),
		p: z.number().optional(),
		px: z.number().optional(),
		py: z.number().optional(),
	}),
	acceptsChildren: true,
};

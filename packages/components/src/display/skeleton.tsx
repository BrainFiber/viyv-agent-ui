import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface SkeletonProps {
	variant?: 'text' | 'circle' | 'rect';
	width?: number | string;
	height?: number | string;
	lines?: number;
	className?: string;
}

export function Skeleton({ variant = 'text', width, height, lines = 3, className }: SkeletonProps) {
	const style: React.CSSProperties = {};
	if (width) style.width = typeof width === 'number' ? `${width}px` : width;
	if (height) style.height = typeof height === 'number' ? `${height}px` : height;

	if (variant === 'circle') {
		const size = width ?? height ?? 40;
		const px = typeof size === 'number' ? `${size}px` : size;
		return (
			<div
				aria-busy="true"
				aria-label="Loading"
				className={cn('animate-pulse rounded-full bg-gray-200', className)}
				style={{ width: px, height: px }}
			/>
		);
	}

	if (variant === 'rect') {
		return (
			<div
				aria-busy="true"
				aria-label="Loading"
				className={cn('animate-pulse rounded bg-gray-200', className)}
				style={{ width: style.width ?? '100%', height: style.height ?? '120px' }}
			/>
		);
	}

	// variant === 'text'
	const lineWidths = [100, 100, 75, 50, 60];
	return (
		<div aria-busy="true" aria-label="Loading" className={cn('space-y-2', className)}>
			{Array.from({ length: lines }, (_, i) => (
				<div
					key={i}
					className="h-4 animate-pulse rounded bg-gray-200"
					style={{ width: `${lineWidths[i % lineWidths.length]}%` }}
				/>
			))}
		</div>
	);
}

export const skeletonMeta: ComponentMeta = {
	type: 'Skeleton',
	label: 'Skeleton',
	description: 'Loading placeholder animation',
	category: 'display',
	propsSchema: z.object({
		variant: z.enum(['text', 'circle', 'rect']).optional(),
		width: z.union([z.number(), z.string()]).optional(),
		height: z.union([z.number(), z.string()]).optional(),
		lines: z.number().optional(),
	}),
	acceptsChildren: false,
};

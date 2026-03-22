import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface ImageProps {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
	objectFit?: 'cover' | 'contain' | 'fill' | 'none';
	className?: string;
}

const objectFitMap: Record<string, string> = {
	cover: 'object-cover',
	contain: 'object-contain',
	fill: 'object-fill',
	none: 'object-none',
};

export function Image({ src, alt = '', width, height, objectFit, className }: ImageProps) {
	return (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={cn('max-w-full rounded', objectFit && objectFitMap[objectFit], className)}
		/>
	);
}

export const imageMeta: ComponentMeta = {
	type: 'Image',
	label: 'Image',
	description: 'Responsive image display',
	category: 'display',
	propsSchema: z.object({
		src: z.string(),
		alt: z.string().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		objectFit: z.enum(['cover', 'contain', 'fill', 'none']).optional(),
	}),
	acceptsChildren: false,
};

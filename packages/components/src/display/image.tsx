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

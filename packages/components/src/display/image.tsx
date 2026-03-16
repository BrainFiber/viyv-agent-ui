import { cn } from '../lib/cn.js';

export interface ImageProps {
	src: string;
	alt?: string;
	width?: number;
	height?: number;
	className?: string;
}

export function Image({ src, alt = '', width, height, className }: ImageProps) {
	return (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={cn('max-w-full rounded', className)}
		/>
	);
}

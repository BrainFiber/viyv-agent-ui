import { useState } from 'react';
import { cn } from '../lib/cn.js';

export interface AvatarProps {
	src?: string;
	name: string;
	size?: 'sm' | 'md' | 'lg';
	className?: string;
}

const sizeMap: Record<string, string> = {
	sm: 'w-8 h-8 text-xs',
	md: 'w-10 h-10 text-sm',
	lg: 'w-12 h-12 text-base',
};

const PALETTE = [
	'bg-red-500',
	'bg-orange-500',
	'bg-amber-500',
	'bg-emerald-500',
	'bg-cyan-500',
	'bg-blue-500',
	'bg-violet-500',
	'bg-pink-500',
];

function hashName(name: string): number {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		hash = (hash * 31 + name.charCodeAt(i)) | 0;
	}
	return Math.abs(hash);
}

function getInitial(name: string): string {
	return name.trim().charAt(0).toUpperCase();
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
	const [imgError, setImgError] = useState(false);
	const showImage = !!src && !imgError;
	const sizeClass = sizeMap[size] ?? sizeMap.md;

	if (showImage) {
		return (
			<img
				src={src}
				alt={name}
				onError={() => setImgError(true)}
				className={cn('rounded-full object-cover shrink-0', sizeClass, className)}
			/>
		);
	}

	const bgColor = PALETTE[hashName(name) % PALETTE.length];

	return (
		<span
			aria-label={name}
			className={cn(
				'inline-flex items-center justify-center rounded-full text-white font-medium shrink-0',
				sizeClass,
				bgColor,
				className,
			)}
		>
			{getInitial(name)}
		</span>
	);
}

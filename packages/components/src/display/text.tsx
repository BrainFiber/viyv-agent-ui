import { cn } from '../lib/cn.js';

export interface TextProps {
	content: string;
	className?: string;
}

export function Text({ content, className }: TextProps) {
	return <p className={cn('text-gray-700', className)}>{content}</p>;
}

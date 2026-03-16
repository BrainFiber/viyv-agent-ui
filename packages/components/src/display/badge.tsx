import { cn } from '../lib/cn.js';

export interface BadgeProps {
	text: string;
	color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red';
	className?: string;
}

const colorMap: Record<string, string> = {
	gray: 'bg-gray-100 text-gray-700',
	blue: 'bg-blue-100 text-blue-700',
	green: 'bg-green-100 text-green-700',
	yellow: 'bg-yellow-100 text-yellow-700',
	red: 'bg-red-100 text-red-700',
};

export function Badge({ text, color = 'gray', className }: BadgeProps) {
	return (
		<span
			className={cn(
				'inline-flex whitespace-nowrap w-fit h-fit rounded-full px-2.5 py-0.5 text-xs font-medium',
				colorMap[color] ?? colorMap.gray,
				className,
			)}
		>
			{text}
		</span>
	);
}

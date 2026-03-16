import { cn } from '../lib/cn.js';

export interface HeaderProps {
	title: string;
	subtitle?: string;
	level?: 1 | 2 | 3;
	className?: string;
}

const headingStyles = {
	1: 'text-3xl font-bold',
	2: 'text-2xl font-semibold',
	3: 'text-xl font-medium',
};

export function Header({ title, subtitle, level = 1, className }: HeaderProps) {
	const Tag = `h${level}` as const;

	return (
		<div className={cn('space-y-1', className)}>
			<Tag className={headingStyles[level]}>{title}</Tag>
			{subtitle && <p className="text-gray-500">{subtitle}</p>}
		</div>
	);
}

import { cn } from '../lib/cn.js';

export interface LinkProps {
	href: string;
	label: string;
	external?: boolean;
	className?: string;
}

export function Link({ href, label, external, className }: LinkProps) {
	return (
		<a
			href={href}
			className={cn('text-blue-600 underline underline-offset-2 hover:text-blue-800', className)}
			{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
		>
			{label}
		</a>
	);
}

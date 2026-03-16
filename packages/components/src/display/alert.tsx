import { cn } from '../lib/cn.js';

export interface AlertProps {
	message: string;
	type?: 'info' | 'success' | 'warning' | 'error';
	title?: string;
	className?: string;
}

const typeStyles: Record<string, string> = {
	info: 'border-blue-200 bg-blue-50 text-blue-800',
	success: 'border-green-200 bg-green-50 text-green-800',
	warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
	error: 'border-red-200 bg-red-50 text-red-800',
};

export function Alert({ message, type = 'info', title, className }: AlertProps) {
	return (
		<div
			role="alert"
			className={cn(
				'rounded-lg border p-4',
				typeStyles[type] ?? typeStyles.info,
				className,
			)}
		>
			{title && <p className="mb-1 font-medium">{title}</p>}
			<p>{message}</p>
		</div>
	);
}

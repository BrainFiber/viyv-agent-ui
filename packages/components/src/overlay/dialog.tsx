import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface DialogProps {
	title: string;
	children?: ReactNode;
	className?: string;
}

export function Dialog({ title, children, className }: DialogProps) {
	const titleId = useId();
	const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		dialogRef.current?.focus();
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" aria-hidden="true" />
			<div
				ref={dialogRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				tabIndex={-1}
				style={{ maxWidth: '32rem' }}
				className={cn('relative z-10 w-full rounded-lg bg-white p-6 shadow-xl focus:outline-none', className)}
			>
				<h2 id={titleId} className="text-lg font-semibold text-gray-900">{title}</h2>
				<div className="mt-4">{children}</div>
			</div>
		</div>
	);
}

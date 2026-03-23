import { z } from 'zod';
import type { ReactNode, FormEvent } from 'react';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface FormProps {
	onSubmit?: () => void;
	children?: ReactNode;
	className?: string;
}

export function Form({ onSubmit, children, className }: FormProps) {
	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSubmit?.();
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={cn('flex flex-col gap-4', className)}
		>
			{children}
		</form>
	);
}

export const formMeta: ComponentMeta = {
	type: 'Form',
	label: 'Form',
	description: 'Form wrapper with submit handling',
	category: 'input',
	propsSchema: z.object({}),
	acceptsChildren: true,
};

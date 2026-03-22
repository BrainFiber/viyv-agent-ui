import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface StepperProps {
	steps: Array<{ label: string; description?: string }>;
	current: number;
	direction?: 'horizontal' | 'vertical';
	className?: string;
}

export function Stepper({ steps, current, direction = 'horizontal', className }: StepperProps) {
	return (
		<div
			role="group"
			aria-label="Progress steps"
			className={cn(
				'flex',
				direction === 'vertical' ? 'flex-col gap-4' : 'items-center gap-2',
				className,
			)}
		>
			{steps.map((step, i) => {
				const isCompleted = i < current;
				const isCurrent = i === current;
				return (
					<div
						key={i}
						className={cn(
							'flex',
							direction === 'vertical' ? 'items-start gap-3' : 'flex-1 items-center gap-2',
						)}
						aria-current={isCurrent ? 'step' : undefined}
					>
						<div
							className={cn(
								'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
								isCompleted && 'bg-green-600 text-white',
								isCurrent && 'border-2 border-blue-600 text-blue-600',
								!isCompleted && !isCurrent && 'border-2 border-gray-300 text-gray-400',
							)}
						>
							{isCompleted ? '\u2713' : i + 1}
						</div>
						<div className="min-w-0">
							<p className={cn('text-sm font-medium', isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-500')}>
								{step.label}
							</p>
							{step.description && (
								<p className="text-xs text-gray-400">{step.description}</p>
							)}
						</div>
						{direction === 'horizontal' && i < steps.length - 1 && (
							<div className={cn('h-0.5 flex-1', isCompleted ? 'bg-green-600' : 'bg-gray-200')} />
						)}
					</div>
				);
			})}
		</div>
	);
}

export const stepperMeta: ComponentMeta = {
	type: 'Stepper',
	label: 'Stepper',
	description: 'Multi-step progress indicator',
	category: 'navigation',
	propsSchema: z.object({
		steps: z.array(z.object({ label: z.string(), description: z.string().optional() })),
		current: z.number(),
		direction: z.enum(['horizontal', 'vertical']).optional(),
	}),
	acceptsChildren: false,
};

import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { cn } from '../lib/cn.js';

export interface RatingProps {
	value?: number;
	max?: number;
	disabled?: boolean;
	label?: string;
	onChange?: (value: number) => void;
	className?: string;
}

export function Rating({
	value = 0,
	max = 5,
	disabled,
	label,
	onChange,
	className,
}: RatingProps) {
	return (
		<div className={cn(className)}>
			{label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
			<div role="radiogroup" aria-label={label ?? 'Rating'} className="flex gap-1">
				{Array.from({ length: max }, (_, i) => {
					const starValue = i + 1;
					const filled = starValue <= value;
					return (
						<button
							key={starValue}
							type="button"
							role="radio"
							aria-checked={starValue === value}
							aria-label={`${starValue} star${starValue > 1 ? 's' : ''}`}
							disabled={disabled}
							onClick={() => onChange?.(starValue)}
							className={cn(
								'text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded',
								filled ? 'text-yellow-400' : 'text-gray-300',
								disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-yellow-400',
							)}
						>
							&#x2605;
						</button>
					);
				})}
			</div>
		</div>
	);
}

export const ratingMeta: ComponentMeta = {
	type: 'Rating',
	label: 'Rating',
	description: 'Star rating input',
	category: 'input',
	propsSchema: z.object({
		value: z.number().optional(),
		max: z.number().optional(),
		label: z.string().optional(),
	}),
	acceptsChildren: false,
};

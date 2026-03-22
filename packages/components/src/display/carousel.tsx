import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, Children, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../lib/cn.js';

export interface CarouselProps {
	autoplay?: boolean;
	interval?: number;
	showDots?: boolean;
	showArrows?: boolean;
	children?: ReactNode;
	className?: string;
}

export function Carousel({
	autoplay = false,
	interval = 5000,
	showDots = true,
	showArrows = true,
	children,
	className,
}: CarouselProps) {
	const childArray = Children.toArray(children);
	const total = childArray.length;
	const [active, setActive] = useState(0);

	const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);
	const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);

	useEffect(() => {
		if (!autoplay || total <= 1) return;
		const timer = setInterval(next, interval);
		return () => clearInterval(timer);
	}, [autoplay, interval, total, next]);

	if (total === 0) return null;

	return (
		<div
			role="region"
			aria-roledescription="carousel"
			aria-label="Slideshow"
			className={cn('relative overflow-hidden', className)}
		>
			<div
				role="group"
				aria-roledescription="slide"
				aria-label={`Slide ${active + 1} of ${total}`}
			>
				{childArray[active]}
			</div>
			{showArrows && total > 1 && (
				<>
					<button
						type="button"
						onClick={prev}
						aria-label="Previous slide"
						className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
					>
						&#x2039;
					</button>
					<button
						type="button"
						onClick={next}
						aria-label="Next slide"
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
					>
						&#x203A;
					</button>
				</>
			)}
			{showDots && total > 1 && (
				<div className="mt-3 flex justify-center gap-2">
					{childArray.map((_, i) => (
						<button
							key={i}
							type="button"
							onClick={() => setActive(i)}
							aria-label={`Go to slide ${i + 1}`}
							className={cn(
								'h-2 w-2 rounded-full transition-colors',
								i === active ? 'bg-blue-600' : 'bg-gray-300',
							)}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export const carouselMeta: ComponentMeta = {
	type: 'Carousel',
	label: 'Carousel',
	description: 'Slideshow content switcher',
	category: 'display',
	propsSchema: z.object({
		autoplay: z.boolean().optional(),
		interval: z.number().optional(),
		showDots: z.boolean().optional(),
		showArrows: z.boolean().optional(),
	}),
	acceptsChildren: true,
};

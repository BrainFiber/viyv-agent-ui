import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useCallback, useEffect, Children } from 'react';
import type { ReactNode } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '../lib/cn.js';
import { ChevronLeft, ChevronRight } from '../lib/icons.js';

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
	const plugins = autoplay ? [Autoplay({ delay: interval, stopOnInteraction: true })] : [];
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const childArray = Children.toArray(children);
	const slideCount = childArray.length;

	const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
	const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
		emblaApi.on('select', onSelect);
		onSelect();
		return () => {
			emblaApi.off('select', onSelect);
		};
	}, [emblaApi]);

	if (slideCount === 0) return null;

	return (
		<div
			role="region"
			aria-roledescription="carousel"
			aria-label="Slideshow"
			className={cn('relative', className)}
		>
			<div ref={emblaRef} className="overflow-hidden rounded-xl">
				<div className="flex">
					{childArray.map((child, i) => (
						<div
							key={i}
							role="group"
							aria-roledescription="slide"
							aria-label={`Slide ${i + 1} of ${slideCount}`}
							className="min-w-0 flex-[0_0_100%]"
						>
							{child}
						</div>
					))}
				</div>
			</div>
			{showArrows && slideCount > 1 && (
				<>
					<button
						type="button"
						onClick={scrollPrev}
						aria-label="Previous slide"
						className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-surface/80 p-1.5 shadow-md backdrop-blur-sm transition-all hover:bg-surface hover:shadow-lg"
					>
						<ChevronLeft aria-hidden="true" className="h-5 w-5" />
					</button>
					<button
						type="button"
						onClick={scrollNext}
						aria-label="Next slide"
						className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-surface/80 p-1.5 shadow-md backdrop-blur-sm transition-all hover:bg-surface hover:shadow-lg"
					>
						<ChevronRight aria-hidden="true" className="h-5 w-5" />
					</button>
				</>
			)}
			{showDots && slideCount > 1 && (
				<div className="mt-3 flex justify-center gap-1.5">
					{childArray.map((_, i) => (
						<button
							key={i}
							type="button"
							aria-current={i === selectedIndex || undefined}
							aria-label={`Go to slide ${i + 1}`}
							onClick={() => emblaApi?.scrollTo(i)}
							className={cn(
								'h-2 w-2 rounded-full transition-colors',
								i === selectedIndex ? 'bg-primary' : 'bg-muted-strong',
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

import { useEffect, useRef, useState, useMemo } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { buildAnimationStyle, type AnimationProps } from './animation-style.js';

/**
 * Unified animation hook — combines style generation and scroll-triggered visibility.
 * Components call this once and merge ref + style into their root element.
 */
export function useAnimation(props: AnimationProps): {
	ref: RefObject<HTMLElement | null>;
	style: CSSProperties;
} {
	const { animate, animateOnScroll } = props;
	const ref = useRef<HTMLElement | null>(null);
	const [isInView, setIsInView] = useState(false);

	const hasAnimation = !!animate && animate !== 'none';

	useEffect(() => {
		if (!hasAnimation || !animateOnScroll || !ref.current) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [hasAnimation, animateOnScroll]);

	const style = useMemo<CSSProperties>(() => {
		if (!hasAnimation) return {};

		// When animateOnScroll is enabled and element is not yet in view, hide it
		if (animateOnScroll && !isInView) {
			return { opacity: 0 };
		}

		return buildAnimationStyle(props).style;
	}, [hasAnimation, animateOnScroll, isInView, props.animate, props.animateDelay, props.animateDuration]);

	return { ref, style };
}

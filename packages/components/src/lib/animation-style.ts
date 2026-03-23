import { z } from 'zod';
import type { CSSProperties } from 'react';

// ── Animation Props (used by Box, Stack, Card, Container, Section) ──

export interface AnimationProps {
	animate?: 'fadeIn' | 'fadeUp' | 'fadeDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'none';
	animateDelay?: number;
	animateDuration?: number;
	animateOnScroll?: boolean;
}

const ANIMATION_MAP: Record<string, string> = {
	fadeIn: 'fade-in',
	fadeUp: 'fade-up',
	fadeDown: 'fade-down',
	slideLeft: 'slide-in-left',
	slideRight: 'slide-in-right',
	scaleIn: 'scale-in',
};

export function buildAnimationStyle(props: AnimationProps): { style: CSSProperties } {
	const { animate, animateDelay, animateDuration = 600 } = props;
	if (!animate || animate === 'none') return { style: {} };

	const keyframeName = ANIMATION_MAP[animate];
	if (!keyframeName) return { style: {} };

	return {
		style: {
			animationName: keyframeName,
			animationDuration: `${animateDuration}ms`,
			animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
			animationFillMode: 'both',
			animationDelay: animateDelay ? `${animateDelay}ms` : undefined,
		},
	};
}

// Shared Zod schema for DRY component Meta definitions
export const animationPropsSchema = z.object({
	animate: z.enum(['fadeIn', 'fadeUp', 'fadeDown', 'slideLeft', 'slideRight', 'scaleIn', 'none']).optional(),
	animateDelay: z.number().optional(),
	animateDuration: z.number().optional(),
	animateOnScroll: z.boolean().optional(),
});

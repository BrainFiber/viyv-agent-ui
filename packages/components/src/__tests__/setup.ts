import { vi } from 'vitest';
import React from 'react';

/**
 * Mock motion/react for unit tests.
 * - motion.div/span/ul → renders the plain HTML element, stripping motion-specific props
 * - AnimatePresence → passes children through immediately (no exit animation delay)
 */
vi.mock('motion/react', () => {
	const motionHandler: ProxyHandler<object> = {
		get(_target, prop: string) {
			return React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
				const {
					variants,
					initial,
					animate,
					exit,
					whileHover,
					whileTap,
					whileFocus,
					whileInView,
					transition,
					onAnimationComplete,
					...rest
				} = props;
				return React.createElement(prop, { ...rest, ref });
			});
		},
	};

	const motion = new Proxy({}, motionHandler);

	function AnimatePresence({ children }: { children?: React.ReactNode; [key: string]: unknown }) {
		return React.createElement(React.Fragment, null, children);
	}

	return { motion, AnimatePresence };
});

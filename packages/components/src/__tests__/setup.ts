import { vi } from 'vitest';
import React from 'react';

/**
 * Polyfill ResizeObserver for jsdom (required by Radix Slider etc.)
 */
globalThis.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
} as unknown as typeof globalThis.ResizeObserver;

/**
 * Polyfill IntersectionObserver for jsdom (required by embla-carousel etc.)
 */
globalThis.IntersectionObserver = class IntersectionObserver {
	readonly root: Element | null = null;
	readonly rootMargin: string = '';
	readonly thresholds: ReadonlyArray<number> = [];
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords(): IntersectionObserverEntry[] { return []; }
} as unknown as typeof globalThis.IntersectionObserver;

/**
 * Polyfill window.matchMedia for jsdom (required by embla-carousel etc.)
 */
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

/**
 * Polyfill PointerEvent for jsdom (required by Radix Tabs, Accordion, etc.)
 */
if (typeof globalThis.PointerEvent === 'undefined') {
	// biome-ignore lint/suspicious/noExplicitAny: minimal polyfill for jsdom
	(globalThis as any).PointerEvent = class PointerEvent extends MouseEvent {
		readonly pointerId: number;
		readonly pointerType: string;
		constructor(type: string, params: PointerEventInit = {}) {
			super(type, params);
			this.pointerId = params.pointerId ?? 0;
			this.pointerType = params.pointerType ?? '';
		}
	};
}

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

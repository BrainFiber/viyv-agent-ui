import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
	'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(containerRef: React.RefObject<HTMLDivElement | null>, active: boolean = true) {
	const previousFocusRef = useRef<Element | null>(null);

	useEffect(() => {
		if (!active) return;
		previousFocusRef.current = document.activeElement;

		const container = containerRef.current;
		if (!container) return;

		// Focus first focusable element
		const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
		if (focusables.length > 0) {
			focusables[0].focus();
		} else {
			container.focus();
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Tab') return;

			const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
			if (elements.length === 0) return;

			const first = elements[0];
			const last = elements[elements.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			}
		};

		container.addEventListener('keydown', handleKeyDown);

		return () => {
			container.removeEventListener('keydown', handleKeyDown);
			// Restore focus
			if (previousFocusRef.current instanceof HTMLElement) {
				previousFocusRef.current.focus();
			}
		};
	}, [containerRef, active]);
}

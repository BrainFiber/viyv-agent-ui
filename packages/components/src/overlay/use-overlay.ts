import { useEffect, useId, useRef } from 'react';
import { useFocusTrap } from './use-focus-trap.js';

let overlayCount = 0;

export function useOverlay() {
	const overlayRef = useRef<HTMLDivElement>(null);
	const titleId = useId();

	useEffect(() => {
		overlayCount++;
		if (overlayCount === 1) {
			document.body.style.overflow = 'hidden';
		}
		return () => {
			overlayCount--;
			if (overlayCount === 0) {
				document.body.style.overflow = '';
			}
		};
	}, []);

	useFocusTrap(overlayRef);

	return { overlayRef, titleId };
}

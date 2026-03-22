import { useCallback, useEffect, useId, useRef } from 'react';
import { useFocusTrap } from './use-focus-trap.js';

let overlayCount = 0;

export function useOverlay(active: boolean = true) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const titleId = useId();
	const lockedRef = useRef(false);

	useEffect(() => {
		if (!active) return;
		overlayCount++;
		lockedRef.current = true;
		if (overlayCount === 1) {
			document.body.style.overflow = 'hidden';
		}
		// cleanup は unlockScroll に委譲 — active=false 時に即解除しない
	}, [active]);

	const unlockScroll = useCallback(() => {
		if (!lockedRef.current) return;
		lockedRef.current = false;
		overlayCount--;
		if (overlayCount === 0) {
			document.body.style.overflow = '';
		}
	}, []);

	// コンポーネントアンマウント時のフェイルセーフ
	useEffect(() => {
		return () => { unlockScroll(); };
	}, [unlockScroll]);

	useFocusTrap(overlayRef, active);

	return { overlayRef, titleId, unlockScroll };
}

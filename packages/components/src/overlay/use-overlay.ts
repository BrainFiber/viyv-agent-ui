import { useEffect, useId, useRef } from 'react';

export function useOverlay() {
	const overlayRef = useRef<HTMLDivElement>(null);
	const titleId = useId();

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		overlayRef.current?.focus();
		return () => {
			document.body.style.overflow = '';
		};
	}, []);

	return { overlayRef, titleId };
}

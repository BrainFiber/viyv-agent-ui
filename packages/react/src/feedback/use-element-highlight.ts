import { useCallback, useEffect, useRef, useState } from 'react';

export interface ElementHighlight {
	hoveredElementId: string | null;
	hoveredRect: DOMRect | null;
	getElementRect: (elementId: string) => DOMRect | null;
}

function getElementIdFromPoint(x: number, y: number): string | null {
	const el = document.elementFromPoint(x, y);
	if (!el) return null;
	const wrapper = el.closest('[data-element-id]');
	if (!wrapper) return null;
	return wrapper.getAttribute('data-element-id');
}

function getRectForElementId(elementId: string): DOMRect | null {
	const wrapper = document.querySelector(
		`[data-element-id="${CSS.escape(elementId)}"]`,
	);
	if (!wrapper) return null;
	// display:contents elements return zero rect — use firstElementChild
	const target = wrapper.firstElementChild ?? wrapper;
	return target.getBoundingClientRect();
}

export function useElementHighlight(enabled: boolean): ElementHighlight {
	const [hoveredElementId, setHoveredElementId] = useState<string | null>(
		null,
	);
	const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);
	const rafRef = useRef<number>(0);

	useEffect(() => {
		if (!enabled) {
			setHoveredElementId(null);
			setHoveredRect(null);
			return;
		}

		const handleMouseMove = (e: MouseEvent) => {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(() => {
				const id = getElementIdFromPoint(e.clientX, e.clientY);
				setHoveredElementId(id);
				if (id) {
					setHoveredRect(getRectForElementId(id));
				} else {
					setHoveredRect(null);
				}
			});
		};

		document.addEventListener('mousemove', handleMouseMove, {
			passive: true,
		});
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			cancelAnimationFrame(rafRef.current);
		};
	}, [enabled]);

	const getElementRect = useCallback((elementId: string) => {
		return getRectForElementId(elementId);
	}, []);

	return { hoveredElementId, hoveredRect, getElementRect };
}

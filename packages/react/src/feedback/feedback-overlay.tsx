import { useEffect } from 'react';
import { useFeedbackContext } from '../providers/feedback-provider.js';
import { useElementHighlight } from './use-element-highlight.js';

const highlightStyle = (rect: DOMRect): React.CSSProperties => ({
	position: 'fixed',
	left: rect.left - 2,
	top: rect.top - 2,
	width: rect.width + 4,
	height: rect.height + 4,
	border: '2px solid #818cf8',
	backgroundColor: 'rgba(129, 140, 248, 0.08)',
	borderRadius: 6,
	pointerEvents: 'none',
	zIndex: 99991,
	transition: 'all 0.1s ease',
});

const labelStyle = (rect: DOMRect): React.CSSProperties => ({
	position: 'fixed',
	left: rect.left - 2,
	top: rect.top - 24,
	fontSize: 11,
	fontFamily: 'system-ui, -apple-system, sans-serif',
	fontWeight: 600,
	color: '#fff',
	backgroundColor: '#6366f1',
	padding: '2px 8px',
	borderRadius: '4px 4px 0 0',
	zIndex: 99992,
	pointerEvents: 'none',
	whiteSpace: 'nowrap',
});

export function FeedbackOverlay() {
	const { enabled, selectElement } = useFeedbackContext();
	const { hoveredElementId, hoveredRect } = useElementHighlight(enabled);

	// Capture clicks via document listener (not overlay div) so elementFromPoint works
	useEffect(() => {
		if (!enabled) return;

		const handleClick = (e: MouseEvent) => {
			// Find the element id from the click target
			const el = e.target as Element | null;
			if (!el) return;
			const wrapper = el.closest('[data-element-id]');
			if (wrapper) {
				e.preventDefault();
				e.stopPropagation();
				const id = wrapper.getAttribute('data-element-id');
				if (id) selectElement(id);
			}
		};

		// Use capture phase to intercept before normal handlers
		document.addEventListener('click', handleClick, { capture: true });
		return () => document.removeEventListener('click', handleClick, { capture: true });
	}, [enabled, selectElement]);

	// Change cursor when feedback mode is active
	useEffect(() => {
		if (!enabled) return;
		document.body.style.cursor = 'crosshair';
		return () => {
			document.body.style.cursor = '';
		};
	}, [enabled]);

	if (!enabled) return null;

	return (
		<>
			{/* Highlight box (pointer-events: none — does not block elementFromPoint) */}
			{hoveredRect && hoveredElementId && (
				<>
					<div style={labelStyle(hoveredRect)}>{hoveredElementId}</div>
					<div style={highlightStyle(hoveredRect)} />
				</>
			)}
		</>
	);
}

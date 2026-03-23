import { useCallback, useEffect, useRef, useState } from 'react';
import { useFeedbackContext } from '../providers/feedback-provider.js';

interface PinPosition {
	elementId: string;
	top: number;
	left: number;
	open: number;
	resolved: number;
}

export function FeedbackIndicators() {
	const { enabled, elementsWithFeedback, selectElement } = useFeedbackContext();
	const [pins, setPins] = useState<PinPosition[]>([]);
	const rafRef = useRef<number>(0);

	const updatePositions = useCallback(() => {
		const newPins: PinPosition[] = [];
		for (const [elementId, counts] of elementsWithFeedback) {
			const wrapper = document.querySelector(
				`[data-element-id="${CSS.escape(elementId)}"]`,
			);
			if (!wrapper) continue;
			const target = wrapper.firstElementChild ?? wrapper;
			const rect = target.getBoundingClientRect();
			if (rect.width === 0 && rect.height === 0) continue;
			newPins.push({
				elementId,
				top: rect.top - 6,
				left: rect.right - 6,
				open: counts.open,
				resolved: counts.resolved,
			});
		}
		setPins(newPins);
	}, [elementsWithFeedback]);

	useEffect(() => {
		// Don't show indicators when feedback mode is ON (overlay handles it)
		if (enabled || elementsWithFeedback.size === 0) {
			setPins([]);
			return;
		}

		updatePositions();

		const handleScroll = () => {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = requestAnimationFrame(updatePositions);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll, { passive: true });
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
			cancelAnimationFrame(rafRef.current);
		};
	}, [enabled, elementsWithFeedback, updatePositions]);

	if (pins.length === 0) return null;

	return (
		<>
			{pins.map((pin) => {
				const hasOpen = pin.open > 0;
				const count = hasOpen ? pin.open : pin.resolved;
				return (
					<button
						key={pin.elementId}
						type="button"
						onClick={() => selectElement(pin.elementId)}
						aria-label={`${pin.elementId}: ${pin.open} open, ${pin.resolved} resolved`}
						style={{
							position: 'fixed',
							top: pin.top,
							left: pin.left,
							width: 20,
							height: 20,
							borderRadius: '50%',
							border: '2px solid #fff',
							backgroundColor: hasOpen ? '#f97316' : '#22c55e',
							color: '#fff',
							fontSize: 10,
							fontWeight: 700,
							fontFamily: 'system-ui, -apple-system, sans-serif',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							zIndex: 99980,
							boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
							padding: 0,
							lineHeight: 1,
							transition: 'transform 0.15s ease',
						}}
						onMouseEnter={(e) => {
							(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.2)';
						}}
						onMouseLeave={(e) => {
							(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
						}}
					>
						{hasOpen ? count : '✓'}
					</button>
				);
			})}
		</>
	);
}

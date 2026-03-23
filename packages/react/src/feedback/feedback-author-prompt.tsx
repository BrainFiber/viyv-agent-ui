import { useCallback, useState } from 'react';
import { useFeedbackContext } from '../providers/feedback-provider.js';

export function FeedbackAuthorPrompt() {
	const { needsAuthorPrompt, dismissAuthorPrompt, setAuthorName } =
		useFeedbackContext();
	const [input, setInput] = useState('');

	const handleSubmit = useCallback(() => {
		const name = input.trim();
		if (!name) return;
		setAuthorName(name);
		dismissAuthorPrompt();
	}, [input, setAuthorName, dismissAuthorPrompt]);

	if (!needsAuthorPrompt) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				style={{
					position: 'fixed',
					inset: 0,
					backgroundColor: 'rgba(0,0,0,0.3)',
					zIndex: 99996,
					animation: 'agent-ui-fb-backdrop-in 0.15s ease-out',
				}}
				onClick={dismissAuthorPrompt}
			/>
			{/* Modal */}
			<div
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 360,
					backgroundColor: '#fff',
					borderRadius: 16,
					boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
					zIndex: 99997,
					padding: '28px 24px',
					fontFamily: 'system-ui, -apple-system, sans-serif',
					animation: 'agent-ui-fb-modal-in 0.2s ease-out',
				}}
			>
				<style>{`
					@keyframes agent-ui-fb-backdrop-in {
						from { opacity: 0; }
						to { opacity: 1; }
					}
					@keyframes agent-ui-fb-modal-in {
						from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
						to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
					}
				`}</style>
				<div
					style={{
						fontSize: 18,
						fontWeight: 700,
						color: '#111827',
						marginBottom: 6,
					}}
				>
					Welcome to Feedback
				</div>
				<div
					style={{
						fontSize: 14,
						color: '#6b7280',
						marginBottom: 20,
						lineHeight: 1.5,
					}}
				>
					コメントに使う名前を入力してください。
				</div>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') handleSubmit();
					}}
					placeholder="Your name"
					autoFocus
					style={{
						width: '100%',
						border: '1px solid #d1d5db',
						borderRadius: 10,
						padding: '10px 14px',
						fontSize: 15,
						outline: 'none',
						boxSizing: 'border-box',
						marginBottom: 16,
					}}
				/>
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
					<button
						type="button"
						onClick={dismissAuthorPrompt}
						style={{
							padding: '8px 16px',
							borderRadius: 8,
							border: '1px solid #e5e7eb',
							background: '#fff',
							color: '#6b7280',
							fontSize: 14,
							cursor: 'pointer',
							fontWeight: 500,
						}}
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!input.trim()}
						style={{
							padding: '8px 20px',
							borderRadius: 8,
							border: 'none',
							background: input.trim() ? '#6366f1' : '#c7d2fe',
							color: '#fff',
							fontSize: 14,
							cursor: input.trim() ? 'pointer' : 'default',
							fontWeight: 600,
						}}
					>
						Start
					</button>
				</div>
			</div>
		</>
	);
}

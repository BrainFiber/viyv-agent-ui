import type { FeedbackThread } from '@viyv/agent-ui-schema';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFeedbackContext } from '../providers/feedback-provider.js';
import { useElementHighlight } from './use-element-highlight.js';
import { authorColor, formatTimeAgo } from './utils.js';

const POPOVER_WIDTH = 340;
const POPOVER_MAX_HEIGHT = 420;

export function FeedbackPopover() {
	const {
		selectedElementId,
		selectElement,
		threads,
		authorName,
		createThread,
		addComment,
		resolveThread,
		completeThread,
		reopenThread,
	} = useFeedbackContext();
	const { getElementRect } = useElementHighlight(false);
	const [input, setInput] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

	// Compute position from selected element
	useEffect(() => {
		if (!selectedElementId) {
			setPosition(null);
			return;
		}
		const rect = getElementRect(selectedElementId);
		if (!rect) {
			setPosition(null);
			return;
		}
		// Position: right side of element, vertically centered
		let left = rect.right + 12;
		let top = rect.top;
		// Flip left if overflowing right
		if (left + POPOVER_WIDTH > window.innerWidth - 16) {
			left = rect.left - POPOVER_WIDTH - 12;
		}
		// Clamp vertical
		if (top + POPOVER_MAX_HEIGHT > window.innerHeight - 16) {
			top = window.innerHeight - POPOVER_MAX_HEIGHT - 16;
		}
		if (top < 16) top = 16;
		if (left < 16) left = 16;
		setPosition({ top, left });
	}, [selectedElementId, getElementRect]);

	// Focus input when opened
	useEffect(() => {
		if (selectedElementId && inputRef.current) {
			inputRef.current.focus();
		}
	}, [selectedElementId]);

	const elementThreads = useMemo(
		() =>
			selectedElementId
				? threads.filter((t) => t.elementId === selectedElementId)
				: [],
		[threads, selectedElementId],
	);

	const handleSubmit = useCallback(async () => {
		if (!input.trim() || !selectedElementId || !authorName) return;
		setSubmitting(true);
		try {
			const author = { name: authorName, type: 'human' as const };
			if (elementThreads.length > 0) {
				// Add comment to first open thread, or the latest thread
				const openThread = elementThreads.find((t) => t.status === 'open');
				const target = openThread ?? elementThreads[0];
				await addComment(target.id, author, input.trim());
			} else {
				await createThread(selectedElementId, author, input.trim());
			}
			setInput('');
		} finally {
			setSubmitting(false);
		}
	}, [input, selectedElementId, authorName, elementThreads, addComment, createThread]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
				e.preventDefault();
				handleSubmit();
			}
			if (e.key === 'Escape') {
				e.stopPropagation();
				selectElement(null);
			}
		},
		[handleSubmit, selectElement],
	);

	if (!selectedElementId || !position) return null;

	return (
		<div
			style={{
				position: 'fixed',
				top: position.top,
				left: position.left,
				width: POPOVER_WIDTH,
				maxHeight: POPOVER_MAX_HEIGHT,
				backgroundColor: '#fff',
				borderRadius: 12,
				boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
				border: '1px solid #e5e7eb',
				zIndex: 99995,
				display: 'flex',
				flexDirection: 'column',
				fontFamily: 'system-ui, -apple-system, sans-serif',
				overflow: 'hidden',
				animation: 'agent-ui-fb-popover-in 0.15s ease-out',
			}}
		>
			<style>{`
				@keyframes agent-ui-fb-popover-in {
					from { opacity: 0; transform: scale(0.95); }
					to { opacity: 1; transform: scale(1); }
				}
			`}</style>
			{/* Header */}
			<div
				style={{
					padding: '10px 14px',
					borderBottom: '1px solid #f3f4f6',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
					{selectedElementId}
				</span>
				<button
					type="button"
					onClick={() => selectElement(null)}
					style={{
						background: 'none',
						border: 'none',
						cursor: 'pointer',
						color: '#9ca3af',
						fontSize: 16,
						padding: '0 2px',
						lineHeight: 1,
					}}
					aria-label="Close"
				>
					×
				</button>
			</div>

			{/* Comments */}
			<div
				style={{
					flex: 1,
					overflowY: 'auto',
					padding: '8px 14px',
				}}
			>
				{elementThreads.map((thread) => (
					<ThreadView
						key={thread.id}
						thread={thread}
						onResolve={resolveThread}
						onComplete={completeThread}
						onReopen={reopenThread}
						currentAuthor={authorName}
					/>
				))}
				{elementThreads.length === 0 && (
					<div
						style={{
							fontSize: 13,
							color: '#9ca3af',
							textAlign: 'center',
							padding: '12px 0',
						}}
					>
						No feedback yet. Leave a comment below.
					</div>
				)}
			</div>

			{/* Input */}
			<div
				style={{
					padding: '10px 14px',
					borderTop: '1px solid #f3f4f6',
					display: 'flex',
					gap: 8,
					alignItems: 'flex-end',
				}}
			>
				<textarea
					ref={inputRef}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="コメントを入力... (Enter で送信)"
					disabled={submitting || !authorName}
					rows={2}
					style={{
						flex: 1,
						border: '1px solid #e5e7eb',
						borderRadius: 8,
						padding: '8px 10px',
						fontSize: 13,
						resize: 'none',
						outline: 'none',
						fontFamily: 'inherit',
						lineHeight: 1.4,
					}}
				/>
			</div>
		</div>
	);
}

function ThreadView({
	thread,
	onResolve,
	onComplete,
	onReopen,
	currentAuthor,
}: {
	thread: FeedbackThread;
	onResolve: (threadId: string, author: { name: string; type: 'human' | 'ai' }, body?: string) => Promise<void>;
	onComplete: (threadId: string) => Promise<void>;
	onReopen: (threadId: string) => Promise<void>;
	currentAuthor: string;
}) {
	return (
		<div style={{ marginBottom: 12 }}>
			{thread.comments.map((comment) => {
				const isAi = comment.author.type === 'ai';
				return (
					<div
						key={comment.id}
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: isAi ? 'flex-end' : 'flex-start',
							marginBottom: 6,
						}}
					>
						<div
							style={{
								fontSize: 11,
								color: '#9ca3af',
								marginBottom: 2,
								display: 'flex',
								alignItems: 'center',
								gap: 4,
							}}
						>
							{isAi ? (
								<span>✨</span>
							) : (
								<span
									style={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										backgroundColor: authorColor(comment.author.name),
										display: 'inline-block',
									}}
								/>
							)}
							<span style={{ fontWeight: 500 }}>{comment.author.name}</span>
							<span>{formatTimeAgo(comment.createdAt)}</span>
						</div>
						<div
							style={{
								backgroundColor: isAi ? '#ede9fe' : '#f3f4f6',
								borderRadius: 12,
								padding: '8px 12px',
								fontSize: 13,
								lineHeight: 1.5,
								color: '#1f2937',
								maxWidth: '85%',
								wordBreak: 'break-word',
							}}
						>
							{comment.body}
						</div>
					</div>
				);
			})}
			{/* Action buttons */}
			<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4, gap: 4 }}>
				{thread.status === 'open' && (
					<button
						type="button"
						onClick={() =>
							onResolve(thread.id, { name: currentAuthor, type: 'human' })
						}
						style={{ fontSize: 11, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: '2px 6px' }}
					>
						✓ Resolve
					</button>
				)}
				{thread.status === 'resolved' && (
					<>
						<button
							type="button"
							onClick={() => onComplete(thread.id)}
							style={{ fontSize: 11, color: '#22c55e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: '2px 6px' }}
						>
							✓ Complete
						</button>
						<button
							type="button"
							onClick={() => onReopen(thread.id)}
							style={{ fontSize: 11, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: '2px 6px' }}
						>
							↺ Reopen
						</button>
					</>
				)}
				{thread.status === 'completed' && (
					<span style={{ fontSize: 11, color: '#9ca3af', padding: '2px 6px' }}>
						Completed
					</span>
				)}
			</div>
		</div>
	);
}

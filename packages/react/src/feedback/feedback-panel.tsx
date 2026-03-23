import type { FeedbackThread } from '@viyv/agent-ui-schema';
import { useCallback, useMemo, useState } from 'react';
import { useFeedbackContext } from '../providers/feedback-provider.js';
import { authorColor, formatTimeAgo } from './utils.js';

type TabFilter = 'open' | 'resolved' | 'completed';

export function FeedbackPanel() {
	const {
		panelOpen,
		setPanelOpen,
		threads,
		authorName,
		setAuthorName,
		selectElement,
		resolveThread,
		completeThread,
		reopenThread,
	} = useFeedbackContext();
	const [activeTab, setActiveTab] = useState<TabFilter>('open');
	const [editingName, setEditingName] = useState(false);
	const [nameInput, setNameInput] = useState(authorName);

	const filtered = useMemo(
		() => threads.filter((t) => t.status === activeTab),
		[threads, activeTab],
	);

	const openCount = useMemo(
		() => threads.filter((t) => t.status === 'open').length,
		[threads],
	);
	const resolvedCount = useMemo(
		() => threads.filter((t) => t.status === 'resolved').length,
		[threads],
	);
	const completedCount = useMemo(
		() => threads.filter((t) => t.status === 'completed').length,
		[threads],
	);

	const handleNameSave = useCallback(() => {
		if (nameInput.trim()) {
			setAuthorName(nameInput.trim());
		}
		setEditingName(false);
	}, [nameInput, setAuthorName]);

	const handleThreadClick = useCallback(
		(thread: FeedbackThread) => {
			selectElement(thread.elementId);
			// Scroll to element
			const wrapper = document.querySelector(
				`[data-element-id="${CSS.escape(thread.elementId)}"]`,
			);
			if (wrapper) {
				const target = wrapper.firstElementChild ?? wrapper;
				target.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
		},
		[selectElement],
	);

	return (
		<>
			{/* Backdrop (subtle) */}
			{panelOpen && (
				<div
					style={{
						position: 'fixed',
						inset: 0,
						zIndex: 99993,
					}}
					onClick={() => setPanelOpen(false)}
				/>
			)}
			{/* Panel */}
			<div
				style={{
					position: 'fixed',
					top: 0,
					right: 0,
					width: 360,
					height: '100vh',
					backgroundColor: '#fff',
					borderLeft: '1px solid #e5e7eb',
					boxShadow: '-4px 0 20px rgba(0,0,0,0.08)',
					zIndex: 99994,
					display: 'flex',
					flexDirection: 'column',
					fontFamily: 'system-ui, -apple-system, sans-serif',
					transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
					transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
				}}
			>
				{/* Header */}
				<div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							marginBottom: 8,
						}}
					>
						<span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>
							Feedback
						</span>
						<button
							type="button"
							onClick={() => setPanelOpen(false)}
							style={{
								background: 'none',
								border: 'none',
								cursor: 'pointer',
								color: '#9ca3af',
								fontSize: 20,
								lineHeight: 1,
								padding: '0 4px',
							}}
							aria-label="Close panel"
						>
							×
						</button>
					</div>
					{/* Author display */}
					<div style={{ fontSize: 12, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 4 }}>
						{editingName ? (
							<>
								<input
									value={nameInput}
									onChange={(e) => setNameInput(e.target.value)}
									onBlur={handleNameSave}
									onKeyDown={(e) => {
										if (e.key === 'Enter') handleNameSave();
									}}
									autoFocus
									style={{
										border: '1px solid #d1d5db',
										borderRadius: 4,
										padding: '2px 6px',
										fontSize: 12,
										width: 120,
										outline: 'none',
									}}
								/>
							</>
						) : (
							<>
								<span
									style={{
										width: 8,
										height: 8,
										borderRadius: '50%',
										backgroundColor: authorName
											? authorColor(authorName)
											: '#d1d5db',
										display: 'inline-block',
									}}
								/>
								<span>
									{authorName || '未設定'} としてコメント中
								</span>
								<button
									type="button"
									onClick={() => {
										setNameInput(authorName);
										setEditingName(true);
									}}
									style={{
										background: 'none',
										border: 'none',
										cursor: 'pointer',
										color: '#9ca3af',
										fontSize: 12,
										padding: 0,
									}}
									aria-label="Edit name"
								>
									✏️
								</button>
							</>
						)}
					</div>
				</div>

				{/* Tabs */}
				<div
					style={{
						display: 'flex',
						borderBottom: '1px solid #f3f4f6',
						padding: '0 20px',
					}}
				>
					<TabButton
						label={`Open (${openCount})`}
						active={activeTab === 'open'}
						onClick={() => setActiveTab('open')}
					/>
					<TabButton
						label={`Resolved (${resolvedCount})`}
						active={activeTab === 'resolved'}
						onClick={() => setActiveTab('resolved')}
					/>
					<TabButton
						label={`Done (${completedCount})`}
						active={activeTab === 'completed'}
						onClick={() => setActiveTab('completed')}
					/>
				</div>

				{/* Thread list */}
				<div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
					{filtered.length === 0 && (
						<div
							style={{
								textAlign: 'center',
								color: '#9ca3af',
								fontSize: 13,
								padding: '24px 0',
							}}
						>
							{activeTab === 'open'
								? 'No open feedback'
								: activeTab === 'resolved'
									? 'No resolved feedback'
									: 'No completed feedback'}
						</div>
					)}
					{filtered.map((thread) => (
						<ThreadCard
							key={thread.id}
							thread={thread}
							onClick={() => handleThreadClick(thread)}
							onResolve={() =>
								resolveThread(thread.id, {
									name: authorName,
									type: 'human',
								})
							}
							onComplete={() => completeThread(thread.id)}
							onReopen={() => reopenThread(thread.id)}
						/>
					))}
				</div>
			</div>
		</>
	);
}

function TabButton({
	label,
	active,
	onClick,
}: {
	label: string;
	active: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			style={{
				background: 'none',
				border: 'none',
				borderBottom: active ? '2px solid #6366f1' : '2px solid transparent',
				cursor: 'pointer',
				padding: '10px 16px',
				fontSize: 13,
				fontWeight: active ? 600 : 400,
				color: active ? '#6366f1' : '#6b7280',
				transition: 'all 0.15s ease',
			}}
		>
			{label}
		</button>
	);
}

function ThreadCard({
	thread,
	onClick,
	onResolve,
	onComplete,
	onReopen,
}: {
	thread: FeedbackThread;
	onClick: () => void;
	onResolve: () => void;
	onComplete: () => void;
	onReopen: () => void;
}) {
	const firstComment = thread.comments[0];
	const isDone = thread.status !== 'open';
	const statusColor =
		thread.status === 'completed'
			? '#6b7280'
			: thread.status === 'resolved'
				? '#22c55e'
				: '#f97316';

	return (
		<div
			style={{
				backgroundColor: isDone ? '#fafafa' : '#fff',
				border: '1px solid #e5e7eb',
				borderRadius: 10,
				padding: '12px 14px',
				marginBottom: 8,
				cursor: 'pointer',
				transition: 'all 0.15s ease',
			}}
			onClick={onClick}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLDivElement).style.borderColor = '#c7d2fe';
				(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(99,102,241,0.08)';
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb';
				(e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
			}}
		>
			{/* Element ID */}
			<div
				style={{
					fontSize: 12,
					fontWeight: 600,
					color: isDone ? '#9ca3af' : '#374151',
					marginBottom: 4,
					display: 'flex',
					alignItems: 'center',
					gap: 6,
				}}
			>
				<span
					style={{
						width: 6,
						height: 6,
						borderRadius: '50%',
						backgroundColor: statusColor,
						display: 'inline-block',
					}}
				/>
				{thread.elementId}
			</div>
			{/* Preview */}
			{firstComment && (
				<div
					style={{
						fontSize: 13,
						color: '#6b7280',
						lineHeight: 1.4,
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						marginBottom: 6,
					}}
				>
					&ldquo;{firstComment.body}&rdquo;
				</div>
			)}
			{/* Footer */}
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					fontSize: 11,
					color: '#9ca3af',
				}}
			>
				<span>
					💬 {thread.comments.length} · {formatTimeAgo(thread.updatedAt)}
				</span>
				<span style={{ display: 'flex', gap: 4 }}>
					{thread.status === 'open' && (
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); onResolve(); }}
							style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', fontSize: 11, fontWeight: 500, padding: '2px 6px' }}
						>
							✓ Resolve
						</button>
					)}
					{thread.status === 'resolved' && (
						<>
							<button
								type="button"
								onClick={(e) => { e.stopPropagation(); onComplete(); }}
								style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', fontSize: 11, fontWeight: 500, padding: '2px 6px' }}
							>
								✓ Complete
							</button>
							<button
								type="button"
								onClick={(e) => { e.stopPropagation(); onReopen(); }}
								style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 11, fontWeight: 500, padding: '2px 6px' }}
							>
								↺ Reopen
							</button>
						</>
					)}
					{thread.status === 'completed' && (
						<button
							type="button"
							onClick={(e) => { e.stopPropagation(); onReopen(); }}
							style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 11, fontWeight: 500, padding: '2px 6px' }}
						>
							↺ Reopen
						</button>
					)}
				</span>
			</div>
		</div>
	);
}

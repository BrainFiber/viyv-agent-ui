import { useMemo } from 'react';
import { useFeedbackContext } from '../providers/feedback-provider.js';

const fabStyle: React.CSSProperties = {
	position: 'fixed',
	bottom: 24,
	right: 24,
	width: 48,
	height: 48,
	borderRadius: '50%',
	border: 'none',
	cursor: 'pointer',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
	transition: 'all 0.2s ease',
	zIndex: 99999,
};

const badgeStyle: React.CSSProperties = {
	position: 'absolute',
	top: -4,
	right: -4,
	minWidth: 18,
	height: 18,
	borderRadius: 9,
	backgroundColor: '#ef4444',
	color: '#fff',
	fontSize: 11,
	fontWeight: 700,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	padding: '0 4px',
};

const CommentIcon = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
	</svg>
);

export function FeedbackToggle() {
	const { toggle, enabled, threads } = useFeedbackContext();

	const openCount = useMemo(
		() => threads.filter((t) => t.status === 'open').length,
		[threads],
	);

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={enabled ? 'Disable feedback mode' : 'Enable feedback mode'}
			style={{
				...fabStyle,
				backgroundColor: enabled ? '#4f46e5' : '#6366f1',
				color: '#fff',
			}}
			onMouseEnter={(e) => {
				(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)';
				(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
			}}
			onMouseLeave={(e) => {
				(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
				(e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
			}}
		>
			<CommentIcon />
			{openCount > 0 && <span style={badgeStyle}>{openCount}</span>}
		</button>
	);
}

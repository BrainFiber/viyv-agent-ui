import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * チーム管理 デモページ
 * 検証: Menu, List, Autocomplete, Empty, Calendar
 */
export const teamDirectorySpec: PageSpec = {
	id: 'team-directory',
	title: 'チーム管理',
	description: 'Menu, List, Autocomplete, Empty, Calendar コンポーネントのデモ',
	hooks: {
		members: {
			use: 'useState',
			params: {
				initial: [
					{ id: '1', name: '田中太郎', role: 'エンジニア', email: 'tanaka@example.com' },
					{ id: '2', name: '鈴木花子', role: 'デザイナー', email: 'suzuki@example.com' },
					{ id: '3', name: '佐藤健一', role: 'PM', email: 'sato@example.com' },
					{ id: '4', name: '山田美咲', role: 'エンジニア', email: 'yamada@example.com' },
					{ id: '5', name: '高橋一郎', role: 'QA', email: 'takahashi@example.com' },
				],
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'layout'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'チーム管理',
				subtitle: 'メンバー検索・スケジュール管理',
			},
		},

		// ── レイアウト: サイドバー + メイン ──
		layout: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 24, align: 'start' },
			children: ['sidebarCard', 'mainContent'],
		},

		// ── サイドバー: Menu ──
		sidebarCard: {
			type: 'Card',
			props: { title: 'ナビゲーション', className: 'w-56 shrink-0' },
			children: ['sideMenu'],
		},
		sideMenu: {
			type: 'Menu',
			props: {
				items: [
					{ label: 'メンバー', icon: '👥', href: '#members', active: true },
					{ label: 'スケジュール', icon: '📅', href: '#schedule' },
					{ label: '設定', icon: '⚙️', href: '#settings' },
				],
				direction: 'vertical',
			},
		},

		// ── メインコンテンツ ──
		mainContent: {
			type: 'Stack',
			props: { gap: 20, className: 'flex-1 min-w-0' },
			children: ['searchCard', 'memberListCard', 'archiveCard', 'calendarCard'],
		},

		// ── Autocomplete: メンバー検索 ──
		searchCard: {
			type: 'Card',
			props: { title: 'メンバー検索' },
			children: ['memberSearch'],
		},
		memberSearch: {
			type: 'Autocomplete',
			props: {
				label: '名前で検索',
				placeholder: 'メンバー名を入力...',
				options: [
					{ value: '1', label: '田中太郎' },
					{ value: '2', label: '鈴木花子' },
					{ value: '3', label: '佐藤健一' },
					{ value: '4', label: '山田美咲' },
					{ value: '5', label: '高橋一郎' },
				],
				value: '$bindState.searchMember',
				onChange: '$action.setSearchMember',
			},
		},

		// ── List: メンバー一覧 ──
		memberListCard: {
			type: 'Card',
			props: { title: 'メンバー一覧' },
			children: ['memberList'],
		},
		memberList: {
			type: 'List',
			props: {
				data: '$hook.members',
				labelKey: 'name',
				secondaryKey: 'role',
				avatarKey: 'name',
				divider: true,
			},
		},

		// ── Empty: アーカイブ（データなし状態の例） ──
		archiveCard: {
			type: 'Card',
			props: { title: 'アーカイブ' },
			children: ['archiveEmpty'],
		},
		archiveEmpty: {
			type: 'Empty',
			props: {
				title: '検索結果なし',
				description: '条件に一致するメンバーが見つかりませんでした。別のキーワードでお試しください。',
				icon: 'search',
			},
			visible: { expr: '$expr(state.searchMember != null && state.searchMember !== "")' },
		},

		// ── Calendar: チームスケジュール ──
		calendarCard: {
			type: 'Card',
			props: { title: 'チームスケジュール' },
			children: ['teamCalendar'],
		},
		teamCalendar: {
			type: 'Calendar',
			props: {
				defaultMonth: '2024-04',
				events: [
					{ date: '2024-04-01', label: 'スプリント開始', color: '#3b82f6' },
					{ date: '2024-04-03', label: 'デザインレビュー', color: '#8b5cf6' },
					{ date: '2024-04-05', label: '週次ミーティング', color: '#10b981' },
					{ date: '2024-04-08', label: '1on1 (田中)', color: '#f59e0b' },
					{ date: '2024-04-10', label: 'リリース判定会議', color: '#ef4444' },
					{ date: '2024-04-12', label: '週次ミーティング', color: '#10b981' },
					{ date: '2024-04-15', label: 'スプリントレビュー', color: '#3b82f6' },
					{ date: '2024-04-17', label: '1on1 (鈴木)', color: '#f59e0b' },
					{ date: '2024-04-19', label: '週次ミーティング', color: '#10b981' },
					{ date: '2024-04-22', label: 'スプリント計画', color: '#3b82f6' },
					{ date: '2024-04-25', label: 'チームランチ', color: '#ec4899' },
					{ date: '2024-04-26', label: '週次ミーティング', color: '#10b981' },
					{ date: '2024-04-30', label: '月末振り返り', color: '#6366f1' },
				],
			},
		},
	},
	state: {
		searchMember: '',
	},
	actions: {
		setSearchMember: { type: 'setState', key: 'searchMember' },
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'team'],
	},
};

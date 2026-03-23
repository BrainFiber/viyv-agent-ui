import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * ナビゲーション総合デモ
 * 検証: Breadcrumbs, Pagination, Menu, Sidebar, NavigationMenu, Menubar,
 *       ContextMenu, DropdownMenu, CommandPalette, Kbd, Stepper
 */
export const navigationShowcaseSpec: PageSpec = {
	id: 'navigation-showcase',
	title: 'ナビゲーション総合デモ',
	description: '全ナビゲーションコンポーネントの実動デモ',
	hooks: {},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'mainGrid', 'contextCard', 'dropdownCard', 'commandCard'],
		},

		/* ── ページヘッダー ── */
		header: {
			type: 'Header',
			props: { title: 'ナビゲーション コンポーネント', subtitle: '全ナビゲーション系UIの実動デモ' },
		},

		/* ── メイン 2 カラム Grid ── */
		mainGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 24 },
			children: ['leftCol', 'rightCol'],
		},

		/* ── 左カラム ── */
		leftCol: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['menubarCard', 'navMenuCard', 'breadcrumbsCard', 'stepperCard'],
		},

		/* Menubar */
		menubarCard: {
			type: 'Card',
			props: { title: 'Menubar' },
			children: ['menubar'],
		},
		menubar: {
			type: 'Menubar',
			props: {
				menus: [
					{
						label: 'ファイル',
						items: [
							{ label: '新規', shortcut: '⌘N' },
							{ label: '開く', shortcut: '⌘O' },
							{ label: '保存', shortcut: '⌘S' },
							{ label: '', separator: true },
							{ label: '印刷', shortcut: '⌘P' },
						],
					},
					{
						label: '編集',
						items: [
							{ label: '元に戻す', shortcut: '⌘Z' },
							{ label: 'やり直し', shortcut: '⇧⌘Z' },
							{ label: '', separator: true },
							{ label: '切り取り', shortcut: '⌘X' },
							{ label: 'コピー', shortcut: '⌘C' },
							{ label: '貼り付け', shortcut: '⌘V' },
						],
					},
					{
						label: '表示',
						items: [
							{ label: 'ズームイン', shortcut: '⌘+' },
							{ label: 'ズームアウト', shortcut: '⌘-' },
							{ label: '', separator: true },
							{ label: '全画面', shortcut: '⌘F' },
						],
					},
				],
			},
		},

		/* NavigationMenu */
		navMenuCard: {
			type: 'Card',
			props: { title: 'NavigationMenu' },
			children: ['navMenu'],
		},
		navMenu: {
			type: 'NavigationMenu',
			props: {
				items: [
					{
						label: 'プロダクト',
						items: [
							{ label: 'API', href: '#', description: 'RESTful API でデータにアクセス' },
							{ label: 'SDK', href: '#', description: '各言語向けの開発キット' },
							{ label: 'ドキュメント', href: '#', description: '詳細なリファレンスガイド' },
						],
					},
					{
						label: 'リソース',
						items: [
							{ label: 'ブログ', href: '#', description: '最新の技術記事' },
							{ label: 'チュートリアル', href: '#', description: 'ステップバイステップの学習' },
							{ label: 'コミュニティ', href: '#', description: '開発者フォーラム' },
						],
					},
					{
						label: '料金',
						href: '#',
					},
				],
			},
		},

		/* Breadcrumbs */
		breadcrumbsCard: {
			type: 'Card',
			props: { title: 'Breadcrumbs' },
			children: ['breadcrumbs'],
		},
		breadcrumbs: {
			type: 'Breadcrumbs',
			props: {
				items: [
					{ label: 'ホーム', href: '#' },
					{ label: 'プロジェクト', href: '#' },
					{ label: '設定', href: '#' },
					{ label: 'セキュリティ' },
				],
			},
		},

		/* Stepper */
		stepperCard: {
			type: 'Card',
			props: { title: 'Stepper' },
			children: ['stepper'],
		},
		stepper: {
			type: 'Stepper',
			props: {
				steps: [
					{ label: 'アカウント作成', description: '基本情報を入力' },
					{ label: 'プロフィール設定', description: '詳細を設定' },
					{ label: '確認', description: '内容を確認' },
				],
				current: 1,
				direction: 'horizontal',
			},
		},

		/* ── 右カラム ── */
		rightCol: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['sidebarCard', 'paginationCard', 'menuCard'],
		},

		/* Sidebar + Menu */
		sidebarCard: {
			type: 'Card',
			props: { title: 'Sidebar' },
			children: ['sidebar'],
		},
		sidebar: {
			type: 'Sidebar',
			props: { width: 200, collapsed: false },
			children: ['sidebarMenu'],
		},
		sidebarMenu: {
			type: 'Menu',
			props: {
				items: [
					{ label: 'ダッシュボード', href: '#', icon: '📊' },
					{ label: 'プロジェクト', href: '#', icon: '📁' },
					{ label: '設定', href: '#', icon: '⚙️' },
					{ label: 'ヘルプ', href: '#', icon: '❓' },
				],
			},
		},

		/* Pagination */
		paginationCard: {
			type: 'Card',
			props: { title: 'Pagination' },
			children: ['pagination'],
		},
		pagination: {
			type: 'Pagination',
			props: {
				totalPages: 10,
				currentPage: '$state.currentPage',
				totalItems: 100,
				pageSize: 10,
				onPageChange: '$action.changePage',
			},
		},

		/* Menu */
		menuCard: {
			type: 'Card',
			props: { title: 'Menu' },
			children: ['menu'],
		},
		menu: {
			type: 'Menu',
			props: {
				items: [
					{ label: 'ダッシュボード', href: '#', icon: '📊' },
					{ label: 'プロジェクト', href: '#', icon: '📁' },
					{
						label: '設定',
						icon: '⚙️',
						children: [
							{ label: '一般', href: '#' },
							{ label: 'セキュリティ', href: '#' },
						],
					},
					{ label: 'ヘルプ', href: '#', icon: '❓' },
				],
			},
		},

		/* ── ContextMenu ── */
		contextCard: {
			type: 'Card',
			props: { title: 'ContextMenu' },
			children: ['contextMenu'],
		},
		contextMenu: {
			type: 'ContextMenu',
			props: {
				items: [
					{ label: '切り取り', value: 'cut', icon: '✂️' },
					{ label: 'コピー', value: 'copy', icon: '📋' },
					{ label: '貼り付け', value: 'paste', icon: '📎' },
					{ label: '', separator: true },
					{ label: '削除', value: 'delete', icon: '🗑️' },
				],
			},
			children: ['contextTarget'],
		},
		contextTarget: {
			type: 'Text',
			props: { content: '右クリックしてください', color: 'muted' },
		},

		/* ── DropdownMenu ── */
		dropdownCard: {
			type: 'Card',
			props: { title: 'DropdownMenu' },
			children: ['dropdownRow'],
		},
		dropdownRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 12, align: 'center' },
			children: ['dropdown'],
		},
		dropdown: {
			type: 'DropdownMenu',
			props: {
				trigger: 'アカウントメニュー',
				items: [
					{ label: 'プロフィール', value: 'profile', icon: '👤' },
					{ label: '設定', value: 'settings', icon: '⚙️' },
					{ label: '', separator: true },
					{ label: 'ログアウト', value: 'logout', icon: '🚪' },
				],
			},
		},

		/* ── CommandPalette ── */
		commandCard: {
			type: 'Card',
			props: { title: 'CommandPalette' },
			children: ['commandRow'],
		},
		commandRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 12, align: 'center' },
			children: ['commandButton', 'commandKbd', 'commandPalette'],
		},
		commandButton: {
			type: 'Button',
			props: { label: 'Ctrl+K で検索', variant: 'secondary', onClick: '$action.openCommand' },
		},
		commandKbd: {
			type: 'Kbd',
			props: { keys: ['⌘', 'K'] },
		},
		commandPalette: {
			type: 'CommandPalette',
			visible: { expr: '$state.commandOpen' },
			props: {
				placeholder: 'ページやアクションを検索...',
				groups: [
					{
						heading: 'ページ',
						items: [
							{ label: 'ダッシュボード', value: 'dashboard' },
							{ label: '設定', value: 'settings' },
							{ label: 'プロフィール', value: 'profile' },
						],
					},
					{
						heading: 'アクション',
						items: [
							{ label: '新規作成', value: 'create' },
							{ label: '検索', value: 'search' },
							{ label: 'ヘルプ', value: 'help' },
						],
					},
				],
			},
		},
	},
	state: {
		commandOpen: false,
		currentPage: 3,
	},
	actions: {
		openCommand: { type: 'setState', key: 'commandOpen', value: true },
		changePage: { type: 'setState', key: 'currentPage' },
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'navigation', 'menubar', 'breadcrumbs', 'sidebar', 'command-palette', 'stepper'],
	},
};

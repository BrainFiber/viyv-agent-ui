import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * バックログ デモページ
 * 検証: DataTable (フィルタ/ソート/pagination), ProgressBar, PieChart, Tabs
 */
export const backlogSpec: PageSpec = {
	id: 'backlog',
	title: 'バックログ',
	description: 'DataTable + ProgressBar を使ったバックログ管理デモ',
	hooks: {
		backlogItems: {
			use: 'useState',
			params: {
				initial: [
					{ id: 'BL-001', title: 'ユーザー登録フロー', category: '機能', sprint: 'Sprint 3', status: '完了', priority: '高', points: 8 },
					{ id: 'BL-002', title: 'パスワードリセット', category: '機能', sprint: 'Sprint 3', status: '完了', priority: '高', points: 5 },
					{ id: 'BL-003', title: 'プロフィール編集', category: '機能', sprint: 'Sprint 3', status: '進行中', priority: '中', points: 5 },
					{ id: 'BL-004', title: '通知メール送信', category: '機能', sprint: 'Sprint 3', status: '進行中', priority: '中', points: 8 },
					{ id: 'BL-005', title: 'ダッシュボードグラフ', category: 'UI', sprint: 'Sprint 3', status: 'ToDo', priority: '高', points: 13 },
					{ id: 'BL-006', title: 'レスポンシブ対応', category: 'UI', sprint: 'Sprint 3', status: '完了', priority: '中', points: 5 },
					{ id: 'BL-007', title: 'API レート制限', category: 'インフラ', sprint: 'Sprint 4', status: 'バックログ', priority: '中', points: 5 },
					{ id: 'BL-008', title: 'ログ集約', category: 'インフラ', sprint: 'Sprint 4', status: 'バックログ', priority: '低', points: 8 },
					{ id: 'BL-009', title: '検索機能', category: '機能', sprint: 'Sprint 4', status: 'バックログ', priority: '高', points: 13 },
					{ id: 'BL-010', title: 'ファイルアップロード', category: '機能', sprint: 'Sprint 4', status: 'バックログ', priority: '中', points: 8 },
					{ id: 'BL-011', title: 'ダークモード', category: 'UI', sprint: 'バックログ', status: 'バックログ', priority: '低', points: 5 },
					{ id: 'BL-012', title: 'アクセシビリティ改善', category: 'UI', sprint: 'バックログ', status: 'バックログ', priority: '中', points: 8 },
					{ id: 'BL-013', title: 'パフォーマンス監視', category: 'インフラ', sprint: 'バックログ', status: 'バックログ', priority: '中', points: 5 },
					{ id: 'BL-014', title: 'セキュリティ監査', category: 'インフラ', sprint: 'Sprint 4', status: 'バックログ', priority: '高', points: 8 },
					{ id: 'BL-015', title: '多言語対応', category: '機能', sprint: 'バックログ', status: 'バックログ', priority: '低', points: 13 },
					{ id: 'BL-016', title: 'E2E テスト整備', category: 'テスト', sprint: 'Sprint 3', status: '進行中', priority: '高', points: 8 },
				],
			},
		},
		sprint3Items: {
			use: 'useDerived',
			from: 'backlogItems',
			params: { filter: { key: 'sprint', match: 'Sprint 3' } },
		},
		sprint3Total: {
			use: 'useDerived',
			from: 'sprint3Items',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
		sprint3Points: {
			use: 'useDerived',
			from: 'sprint3Items',
			params: { aggregate: { fn: 'sum', key: 'points' } },
		},
		sprint3Done: {
			use: 'useDerived',
			from: 'sprint3Items',
			params: { filter: { key: 'status', match: '完了' }, aggregate: { fn: 'count', key: 'id' } },
		},
		sprint3DonePoints: {
			use: 'useDerived',
			from: 'sprint3Items',
			params: { filter: { key: 'status', match: '完了' }, aggregate: { fn: 'sum', key: 'points' } },
		},
		categoryDist: {
			use: 'useDerived',
			from: 'backlogItems',
			params: { groupBy: 'category', aggregate: { fn: 'count', key: 'id' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'sprintCard', 'tabs', 'navLinks'],
		},
		header: {
			type: 'Header',
			props: { title: 'バックログ', subtitle: '全アイテム一覧と進捗管理' },
		},
		sprintCard: {
			type: 'Card',
			props: { title: 'Sprint 3 進捗' },
			children: ['sprintProgress', 'sprintStats'],
		},
		sprintProgress: {
			type: 'ProgressBar',
			props: {
				value: 43,
				size: 'lg',
				showValue: true,
				color: 'green',
				label: 'Sprint 3 完了率',
			},
		},
		sprintStats: {
			type: 'Grid',
			props: { columns: 4, gap: 16 },
			children: ['statSprintTasks', 'statSprintPoints', 'statSprintDone', 'statSprintDonePoints'],
		},
		statSprintTasks: {
			type: 'Stat',
			props: { label: 'Sprint タスク数', value: '$hook.sprint3Total', format: 'number' },
		},
		statSprintPoints: {
			type: 'Stat',
			props: { label: '見積合計', value: '$hook.sprint3Points', format: 'number' },
		},
		statSprintDone: {
			type: 'Stat',
			props: { label: '完了タスク', value: '$hook.sprint3Done', format: 'number' },
		},
		statSprintDonePoints: {
			type: 'Stat',
			props: { label: '完了ポイント', value: '$hook.sprint3DonePoints', format: 'number' },
		},
		tabs: {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'all', label: '全バックログ' },
					{ id: 'chart', label: 'カテゴリ分布' },
				],
			},
			children: ['allPanel', 'chartPanel'],
		},
		allPanel: {
			type: 'DataTable',
			props: {
				data: '$hook.backlogItems',
				keyField: 'id',
				pageSize: 8,
				columns: [
					{ key: 'id', label: 'ID', sortable: true, minWidth: 80 },
					{ key: 'title', label: 'タイトル', sortable: true },
					{
						key: 'category',
						label: 'カテゴリ',
						sortable: true,
						format: 'badge',
						badgeMap: { '機能': 'blue', 'UI': 'green', 'インフラ': 'yellow', 'テスト': 'gray' },
						filter: {
							type: 'select',
							options: [
								{ value: '機能', label: '機能' },
								{ value: 'UI', label: 'UI' },
								{ value: 'インフラ', label: 'インフラ' },
								{ value: 'テスト', label: 'テスト' },
							],
						},
					},
					{ key: 'sprint', label: 'Sprint', sortable: true },
					{
						key: 'status',
						label: 'ステータス',
						sortable: true,
						format: 'badge',
						badgeMap: { '完了': 'green', '進行中': 'blue', 'ToDo': 'yellow', 'バックログ': 'gray' },
						filter: {
							type: 'select',
							options: [
								{ value: '完了', label: '完了' },
								{ value: '進行中', label: '進行中' },
								{ value: 'ToDo', label: 'ToDo' },
								{ value: 'バックログ', label: 'バックログ' },
							],
						},
					},
					{
						key: 'priority',
						label: '優先度',
						sortable: true,
						format: 'badge',
						badgeMap: { '高': 'red', '中': 'yellow', '低': 'gray' },
					},
					{ key: 'points', label: 'ポイント', sortable: true, format: 'number' },
				],
			},
		},
		chartPanel: {
			type: 'Card',
			props: { title: 'カテゴリ別アイテム分布' },
			children: ['categoryChart'],
		},
		categoryChart: {
			type: 'PieChart',
			props: {
				data: '$hook.categoryDist',
				nameKey: 'category',
				valueKey: 'id_count',
				title: 'カテゴリ別分布',
			},
		},
		navLinks: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['linkKanban', 'linkTicket'],
		},
		linkKanban: {
			type: 'Link',
			props: { href: '/pages/kanban-board', label: 'カンバンボードへ' },
		},
		linkTicket: {
			type: 'Link',
			props: { href: '/pages/ticket-detail-pm', label: 'チケット詳細サンプル' },
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'backlog', 'data-table', 'progress-bar', 'pie-chart'],
	},
};

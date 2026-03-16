import type { PageSpec } from '@viyv/agent-ui-schema';

const tasks = [
	{
		id: 'TASK-001',
		title: 'ユーザー認証API実装',
		status: '完了',
		priority: '高',
		assignee: '田中 太郎',
		dueDate: '2026-03-10',
		estimate: 8,
	},
	{
		id: 'TASK-002',
		title: 'ダッシュボードUIデザイン',
		status: '進行中',
		priority: '高',
		assignee: '佐藤 花子',
		dueDate: '2026-03-15',
		estimate: 13,
	},
	{
		id: 'TASK-003',
		title: 'データベースマイグレーション',
		status: '進行中',
		priority: '中',
		assignee: '鈴木 一郎',
		dueDate: '2026-03-12',
		estimate: 5,
	},
	{
		id: 'TASK-004',
		title: 'E2Eテスト追加',
		status: '未着手',
		priority: '中',
		assignee: '田中 太郎',
		dueDate: '2026-03-20',
		estimate: 8,
	},
	{
		id: 'TASK-005',
		title: 'CI/CDパイプライン構築',
		status: '未着手',
		priority: '低',
		assignee: '佐藤 花子',
		dueDate: '2026-03-25',
		estimate: 5,
	},
	{
		id: 'TASK-006',
		title: 'パフォーマンス最適化',
		status: '進行中',
		priority: '高',
		assignee: '鈴木 一郎',
		dueDate: '2026-03-18',
		estimate: 13,
	},
	{
		id: 'TASK-007',
		title: 'ドキュメント整備',
		status: '未着手',
		priority: '低',
		assignee: '田中 太郎',
		dueDate: '2026-03-30',
		estimate: 3,
	},
	{
		id: 'TASK-008',
		title: 'セキュリティ監査対応',
		status: '完了',
		priority: '高',
		assignee: '佐藤 花子',
		dueDate: '2026-03-08',
		estimate: 5,
	},
];

export const taskBoardSpec: PageSpec = {
	id: 'task-board',
	title: 'タスク管理ボード',
	description:
		'DataTable の rowHref による詳細遷移、Badge でステータス/優先度表示、Alert/Link/Divider を活用したタスク管理画面。',
	hooks: {
		tasks: {
			use: 'useState',
			params: { initial: tasks },
		},
		taskCount: {
			use: 'useDerived',
			from: 'tasks',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
		totalEstimate: {
			use: 'useDerived',
			from: 'tasks',
			params: { aggregate: { fn: 'sum', key: 'estimate' } },
		},
		completedTasks: {
			use: 'useDerived',
			from: 'tasks',
			params: { filter: { key: 'status', match: '完了' } },
		},
		completedCount: {
			use: 'useDerived',
			from: 'completedTasks',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
		inProgressTasks: {
			use: 'useDerived',
			from: 'tasks',
			params: { filter: { key: 'status', match: '進行中' } },
		},
		inProgressCount: {
			use: 'useDerived',
			from: 'inProgressTasks',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'alertInfo', 'statsGrid', 'divider1', 'tableCard', 'footer'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'タスク管理ボード',
				subtitle: 'Sprint 2026-Q1-3 (3/1 - 3/31)',
			},
		},
		alertInfo: {
			type: 'Alert',
			props: {
				type: 'info',
				title: 'Sprint 進行中',
				message:
					'このスプリントの期間は 2026/3/1 〜 3/31 です。各行をクリックするとタスク詳細に遷移します。',
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 4, gap: 4 },
			children: ['statTotal', 'statCompleted', 'statInProgress', 'statEstimate'],
		},
		statTotal: {
			type: 'Stat',
			props: {
				label: '全タスク',
				value: '$hook.taskCount',
				format: 'number',
			},
		},
		statCompleted: {
			type: 'Stat',
			props: {
				label: '完了',
				value: '$hook.completedCount',
				format: 'number',
			},
		},
		statInProgress: {
			type: 'Stat',
			props: {
				label: '進行中',
				value: '$hook.inProgressCount',
				format: 'number',
			},
		},
		statEstimate: {
			type: 'Stat',
			props: {
				label: '合計見積 (pt)',
				value: '$hook.totalEstimate',
				format: 'number',
			},
		},
		divider1: {
			type: 'Divider',
			props: {},
		},
		tableCard: {
			type: 'Card',
			props: { title: 'タスク一覧' },
			children: ['taskTable'],
		},
		taskTable: {
			type: 'DataTable',
			props: {
				data: '$hook.tasks',
				rowHref: '/pages/task-detail?id={{id}}',
				keyField: 'id',
				emptyMessage: 'タスクがありません',
				columns: [
					{ key: 'id', label: 'ID' },
					{ key: 'title', label: 'タスク名', sortable: true },
					{ key: 'status', label: 'ステータス', sortable: true },
					{ key: 'priority', label: '優先度', sortable: true },
					{ key: 'assignee', label: '担当者', sortable: true },
					{ key: 'dueDate', label: '期限', sortable: true, format: 'date' },
					{ key: 'estimate', label: '見積(pt)', sortable: true, format: 'number' },
				],
			},
		},
		footer: {
			type: 'Stack',
			props: { gap: 2 },
			children: ['footerDivider', 'footerLink'],
		},
		footerDivider: {
			type: 'Divider',
			props: {},
		},
		footerLink: {
			type: 'Link',
			props: {
				href: '/pages/sales-dashboard',
				label: '売上ダッシュボードを見る',
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'task-management', 'datatable-rowhref'],
	},
};

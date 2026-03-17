import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * カンバンボード デモページ
 * 検証: KanbanBoard (groupKey, columns, $item.xxx), Avatar, Badge
 */
export const kanbanBoardSpec: PageSpec = {
	id: 'kanban-board',
	title: 'カンバンボード',
	description: 'KanbanBoard レンダラーを使ったタスク管理デモ',
	hooks: {
		kanbanTasks: {
			use: 'useState',
			params: {
				initial: [
					{ id: 'KB-001', title: 'ログイン画面デザイン', status: 'done', priority: '高', assignee: '田中太郎', estimate: 5 },
					{ id: 'KB-002', title: 'API エンドポイント設計', status: 'done', priority: '高', assignee: '高橋翔太', estimate: 8 },
					{ id: 'KB-003', title: 'DB マイグレーション', status: 'review', priority: '中', assignee: '伊藤理恵', estimate: 3 },
					{ id: 'KB-004', title: 'ユーザー認証実装', status: 'in-progress', priority: '高', assignee: '高橋翔太', estimate: 13 },
					{ id: 'KB-005', title: 'ダッシュボード UI', status: 'in-progress', priority: '中', assignee: '鈴木花子', estimate: 8 },
					{ id: 'KB-006', title: '通知システム', status: 'todo', priority: '低', assignee: '佐藤健一', estimate: 5 },
					{ id: 'KB-007', title: 'パフォーマンス最適化', status: 'todo', priority: '中', assignee: '渡辺大輝', estimate: 5 },
					{ id: 'KB-008', title: 'E2E テスト追加', status: 'todo', priority: '中', assignee: '中村さくら', estimate: 8 },
					{ id: 'KB-009', title: 'CI/CD パイプライン改善', status: 'review', priority: '低', assignee: '小林拓也', estimate: 3 },
					{ id: 'KB-010', title: '検索機能実装', status: 'in-progress', priority: '高', assignee: '山田美咲', estimate: 8 },
					{ id: 'KB-011', title: 'エラーハンドリング改善', status: 'todo', priority: '低', assignee: '伊藤理恵', estimate: 3 },
					{ id: 'KB-012', title: 'レスポンシブ対応', status: 'done', priority: '中', assignee: '鈴木花子', estimate: 5 },
				],
			},
		},
		todoCount: {
			use: 'useDerived',
			from: 'kanbanTasks',
			params: { filter: { key: 'status', match: 'todo' }, aggregate: { fn: 'count', key: 'id' } },
		},
		inProgressCount: {
			use: 'useDerived',
			from: 'kanbanTasks',
			params: { filter: { key: 'status', match: 'in-progress' }, aggregate: { fn: 'count', key: 'id' } },
		},
		reviewCount: {
			use: 'useDerived',
			from: 'kanbanTasks',
			params: { filter: { key: 'status', match: 'review' }, aggregate: { fn: 'count', key: 'id' } },
		},
		doneCount: {
			use: 'useDerived',
			from: 'kanbanTasks',
			params: { filter: { key: 'status', match: 'done' }, aggregate: { fn: 'count', key: 'id' } },
		},
		totalEstimate: {
			use: 'useDerived',
			from: 'kanbanTasks',
			params: { aggregate: { fn: 'sum', key: 'estimate' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'statsGrid', 'boardCard', 'navLinks'],
		},
		header: {
			type: 'Header',
			props: { title: 'カンバンボード', subtitle: 'Sprint 3 タスク管理' },
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 5, gap: 12 },
			children: ['statTodo', 'statInProgress', 'statReview', 'statDone', 'statEstimate'],
		},
		statTodo: {
			type: 'Stat',
			props: { label: 'ToDo', value: '$hook.todoCount', format: 'number' },
		},
		statInProgress: {
			type: 'Stat',
			props: { label: '進行中', value: '$hook.inProgressCount', format: 'number' },
		},
		statReview: {
			type: 'Stat',
			props: { label: 'レビュー', value: '$hook.reviewCount', format: 'number' },
		},
		statDone: {
			type: 'Stat',
			props: { label: '完了', value: '$hook.doneCount', format: 'number' },
		},
		statEstimate: {
			type: 'Stat',
			props: { label: '合計見積', value: '$hook.totalEstimate', format: 'number' },
		},
		boardCard: {
			type: 'Stack',
			props: { gap: 0 },
			children: ['kanban'],
		},
		kanban: {
			type: 'KanbanBoard',
			props: {
				data: '$hook.kanbanTasks',
				groupKey: 'status',
				columns: [
					{ value: 'todo', label: 'ToDo' },
					{ value: 'in-progress', label: '進行中' },
					{ value: 'review', label: 'レビュー' },
					{ value: 'done', label: '完了' },
				],
				keyField: 'id',
			},
			children: ['taskCard'],
		},
		taskCard: {
			type: 'Stack',
			props: { gap: 6, className: 'p-3' },
			children: ['taskCardHeader', 'taskTitle', 'taskCardFooter'],
		},
		taskCardHeader: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4, align: 'center' },
			children: ['priorityBadge', 'estimateBadge', 'taskId'],
		},
		priorityBadge: {
			type: 'Badge',
			props: {
				text: '$item.priority',
				color: '$expr(item.priority === "高" ? "red" : item.priority === "中" ? "yellow" : "gray")',
			},
		},
		estimateBadge: {
			type: 'Badge',
			props: {
				text: '$expr(item.estimate + " pt")',
				color: 'blue',
			},
		},
		taskId: {
			type: 'Text',
			props: { content: '$item.id', size: 'xs', color: 'muted', className: 'ml-auto' },
		},
		taskTitle: {
			type: 'Text',
			props: { content: '$item.title', weight: 'semibold', size: 'sm' },
		},
		taskCardFooter: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 6, align: 'center', className: 'pt-1 border-t border-gray-100' },
			children: ['assigneeAvatar', 'assigneeName'],
		},
		assigneeAvatar: {
			type: 'Avatar',
			props: { name: '$item.assignee', size: 'sm' },
		},
		assigneeName: {
			type: 'Text',
			props: { content: '$item.assignee', size: 'xs', color: 'muted' },
		},
		navLinks: {
			type: 'Grid',
			props: { columns: 3, gap: 16 },
			children: ['linkStructure', 'linkGantt', 'linkBacklog'],
		},
		linkStructure: {
			type: 'Link',
			props: { href: '/pages/project-structure', label: 'プロジェクト構成図へ' },
		},
		linkGantt: {
			type: 'Link',
			props: { href: '/pages/gantt-schedule', label: 'ガントチャートへ' },
		},
		linkBacklog: {
			type: 'Link',
			props: { href: '/pages/backlog', label: 'バックログへ' },
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'kanban', 'board', 'avatar', 'badge'],
	},
};

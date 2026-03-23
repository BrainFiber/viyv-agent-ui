import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * プロジェクトボード デモ
 * 検証: KanbanBoard, GanttChart, Stat, Badge, Avatar, Tag, Button,
 *       Dialog, DropdownMenu, Tooltip
 */
export const kanbanProjectSpec: PageSpec = {
	id: 'kanban-project',
	title: 'プロジェクトボード',
	description: 'KanbanBoard + ガントチャートによるプロジェクト管理',
	hooks: {
		tasks: {
			use: 'useState',
			params: {
				initial: [
					{ id: 'SP4-001', title: 'ユーザー認証リファクタ', status: '未着手', priority: '高', assignee: '田中太郎', storyPoints: 8, epic: '認証' },
					{ id: 'SP4-002', title: 'API レスポンスキャッシュ', status: '未着手', priority: '中', assignee: '高橋翔太', storyPoints: 5, epic: 'パフォーマンス' },
					{ id: 'SP4-003', title: 'ダッシュボード再設計', status: '未着手', priority: '高', assignee: '鈴木花子', storyPoints: 13, epic: 'UI' },
					{ id: 'SP4-004', title: 'WebSocket 通知', status: '未着手', priority: '低', assignee: '佐藤健一', storyPoints: 5, epic: 'リアルタイム' },
					{ id: 'SP4-005', title: 'E2E テスト拡充', status: '未着手', priority: '中', assignee: '中村さくら', storyPoints: 3, epic: 'テスト' },
					{ id: 'SP4-006', title: '検索フィルタ実装', status: '進行中', priority: '高', assignee: '山田美咲', storyPoints: 8, epic: '検索' },
					{ id: 'SP4-007', title: 'バッチ処理最適化', status: '進行中', priority: '中', assignee: '渡辺大輝', storyPoints: 5, epic: 'パフォーマンス' },
					{ id: 'SP4-008', title: 'メール通知テンプレート', status: '進行中', priority: '低', assignee: '伊藤理恵', storyPoints: 3, epic: '通知' },
					{ id: 'SP4-009', title: 'RBAC 権限設定', status: 'レビュー', priority: '高', assignee: '高橋翔太', storyPoints: 8, epic: '認証' },
					{ id: 'SP4-010', title: 'CSV エクスポート', status: 'レビュー', priority: '中', assignee: '小林拓也', storyPoints: 3, epic: 'データ' },
					{ id: 'SP4-011', title: 'ログイン画面刷新', status: '完了', priority: '高', assignee: '鈴木花子', storyPoints: 5, epic: 'UI' },
					{ id: 'SP4-012', title: 'CI パイプライン改善', status: '完了', priority: '中', assignee: '小林拓也', storyPoints: 3, epic: 'インフラ' },
					{ id: 'SP4-013', title: 'API ドキュメント更新', status: '完了', priority: '低', assignee: '佐藤健一', storyPoints: 2, epic: 'ドキュメント' },
					{ id: 'SP4-014', title: 'パスワードポリシー強化', status: '完了', priority: '高', assignee: '田中太郎', storyPoints: 5, epic: '認証' },
					{ id: 'SP4-015', title: 'レスポンシブ対応修正', status: '完了', priority: '中', assignee: '山田美咲', storyPoints: 3, epic: 'UI' },
					{ id: 'SP4-016', title: 'DB インデックス最適化', status: '完了', priority: '高', assignee: '渡辺大輝', storyPoints: 5, epic: 'パフォーマンス' },
					{ id: 'SP4-017', title: 'Slack 連携', status: '完了', priority: '中', assignee: '伊藤理恵', storyPoints: 5, epic: '通知' },
					{ id: 'SP4-018', title: 'ユニットテスト追加', status: '完了', priority: '低', assignee: '中村さくら', storyPoints: 3, epic: 'テスト' },
				],
			},
		},
		todoCount: {
			use: 'useDerived',
			from: 'tasks',
			params: { filter: { key: 'status', match: '未着手' }, aggregate: { fn: 'count', key: 'id' } },
		},
		inProgressCount: {
			use: 'useDerived',
			from: 'tasks',
			params: { filter: { key: 'status', match: '進行中' }, aggregate: { fn: 'count', key: 'id' } },
		},
		reviewCount: {
			use: 'useDerived',
			from: 'tasks',
			params: { filter: { key: 'status', match: 'レビュー' }, aggregate: { fn: 'count', key: 'id' } },
		},
		doneCount: {
			use: 'useDerived',
			from: 'tasks',
			params: { filter: { key: 'status', match: '完了' }, aggregate: { fn: 'count', key: 'id' } },
		},
		totalSP: {
			use: 'useDerived',
			from: 'tasks',
			params: { aggregate: { fn: 'sum', key: 'storyPoints' } },
		},
		ganttData: {
			use: 'useState',
			params: {
				initial: [
					{ task: 'ユーザー認証リファクタ', start: '2026-03-17', end: '2026-03-24', progress: 0, phase: '認証' },
					{ task: 'API レスポンスキャッシュ', start: '2026-03-17', end: '2026-03-21', progress: 0, phase: 'パフォーマンス' },
					{ task: 'ダッシュボード再設計', start: '2026-03-18', end: '2026-03-28', progress: 0, phase: 'UI' },
					{ task: '検索フィルタ実装', start: '2026-03-10', end: '2026-03-21', progress: 50, phase: '検索' },
					{ task: 'バッチ処理最適化', start: '2026-03-12', end: '2026-03-20', progress: 60, phase: 'パフォーマンス' },
					{ task: 'RBAC 権限設定', start: '2026-03-10', end: '2026-03-19', progress: 85, phase: '認証' },
					{ task: 'CSV エクスポート', start: '2026-03-14', end: '2026-03-19', progress: 90, phase: 'データ' },
					{ task: 'ログイン画面刷新', start: '2026-03-03', end: '2026-03-14', progress: 100, phase: 'UI' },
					{ task: 'CI パイプライン改善', start: '2026-03-05', end: '2026-03-12', progress: 100, phase: 'インフラ' },
					{ task: 'パスワードポリシー強化', start: '2026-03-03', end: '2026-03-10', progress: 100, phase: '認証' },
				],
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'statsGrid', 'kanban', 'divider', 'ganttCard', 'taskDetailDialog'],
		},

		/* ── ページヘッダー ── */
		header: {
			type: 'Header',
			props: { title: 'プロジェクトボード — Sprint 4', subtitle: '2026年3月 第3〜4週' },
		},

		/* ── 統計カード ── */
		statsGrid: {
			type: 'Grid',
			props: { columns: 5, gap: 12 },
			children: ['statTodo', 'statInProgress', 'statReview', 'statDone', 'statTotalSP'],
		},
		statTodo: {
			type: 'Stat',
			props: { label: '未着手', value: '$hook.todoCount', format: 'number' },
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
		statTotalSP: {
			type: 'Stat',
			props: { label: '合計SP', value: '$hook.totalSP', format: 'number' },
		},

		/* ── カンバンボード ── */
		kanban: {
			type: 'KanbanBoard',
			props: {
				data: '$hook.tasks',
				groupKey: 'status',
				columns: [
					{ value: '未着手', label: '未着手' },
					{ value: '進行中', label: '進行中' },
					{ value: 'レビュー', label: 'レビュー' },
					{ value: '完了', label: '完了' },
				],
				keyField: 'id',
			},
			children: ['taskCard'],
		},
		taskCard: {
			type: 'Stack',
			props: { gap: 6, className: 'p-3' },
			children: ['taskCardTop', 'taskTitle', 'taskCardBottom'],
		},
		taskCardTop: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4, align: 'center' },
			children: ['taskPriorityBadge', 'taskEpicTag', 'taskSPTooltip'],
		},
		taskPriorityBadge: {
			type: 'Badge',
			props: {
				text: '$item.priority',
				color: '$expr(item.priority === "高" ? "red" : item.priority === "中" ? "yellow" : "gray")',
			},
		},
		taskEpicTag: {
			type: 'Tag',
			props: { label: '$item.epic', color: 'blue' },
		},
		taskSPTooltip: {
			type: 'Tooltip',
			props: { content: '$expr(`ストーリーポイント: ${item.storyPoints}`)', position: 'top' },
			children: ['taskSPBadge'],
		},
		taskSPBadge: {
			type: 'Badge',
			props: { text: '$expr(item.storyPoints + " SP")', color: 'blue' },
		},
		taskTitle: {
			type: 'Text',
			props: { content: '$item.title', weight: 'semibold', size: 'sm' },
		},
		taskCardBottom: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 6, align: 'center', className: 'pt-1 border-t border-gray-100' },
			children: ['taskAvatar', 'taskAssignee', 'taskDropdown'],
		},
		taskAvatar: {
			type: 'Avatar',
			props: { name: '$item.assignee', size: 'sm' },
		},
		taskAssignee: {
			type: 'Text',
			props: { content: '$item.assignee', size: 'xs', color: 'muted' },
		},
		taskDropdown: {
			type: 'DropdownMenu',
			props: {
				trigger: '⋯',
				items: [
					{ label: '詳細を見る', value: 'detail' },
					{ label: '編集', value: 'edit' },
					{ label: '', separator: true },
					{ label: '削除', value: 'delete' },
				],
			},
		},

		/* ── 区切り線 ── */
		divider: {
			type: 'Divider',
			props: {},
		},

		/* ── ガントチャート ── */
		ganttCard: {
			type: 'Card',
			props: { title: 'スプリントタイムライン' },
			children: ['gantt'],
		},
		gantt: {
			type: 'GanttChart',
			props: {
				data: '$hook.ganttData',
				taskKey: 'task',
				startKey: 'start',
				endKey: 'end',
				progressKey: 'progress',
				groupKey: 'phase',
				title: 'Sprint 4 タスクスケジュール',
			},
		},

		/* ── タスク詳細ダイアログ ── */
		taskDetailDialog: {
			type: 'Dialog',
			props: {
				title: 'タスク詳細',
				open: '$state.showTaskDetail',
			},
			children: ['taskDetailContent'],
			visible: { expr: '$state.showTaskDetail' },
		},
		taskDetailContent: {
			type: 'Stack',
			props: { gap: 12 },
			children: ['taskDetailText', 'taskDetailCloseBtn'],
		},
		taskDetailText: {
			type: 'Text',
			props: { content: 'タスクの詳細情報がここに表示されます。担当者、期限、ステータスの変更などが行えます。' },
		},
		taskDetailCloseBtn: {
			type: 'Button',
			props: { label: '閉じる', variant: 'secondary', onClick: '$action.closeTaskDetail' },
		},
	},
	state: {
		showTaskDetail: false,
	},
	actions: {
		openTaskDetail: { type: 'setState', key: 'showTaskDetail', value: true },
		closeTaskDetail: { type: 'setState', key: 'showTaskDetail', value: false },
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'kanban', 'project', 'gantt', 'board', 'sprint'],
	},
};

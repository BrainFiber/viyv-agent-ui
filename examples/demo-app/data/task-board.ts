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
		'タスクの追加・編集・削除が可能なCRUD対応タスク管理画面。',
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
			children: [
				'header',
				'alertInfo',
				'statsGrid',
				'divider1',
				'addBtn',
				'tableCard',
				'footer',
				'addDialog',
				'editDialog',
				'deleteConfirmDialog',
			],
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
					'このスプリントの期間は 2026/3/1 〜 3/31 です。各行をクリックするとタスクを編集できます。',
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
		addBtn: {
			type: 'Button',
			props: {
				label: 'タスク追加',
				variant: 'primary',
				onClick: '$action.openAddDialog',
			},
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
				onRowClick: '$action.selectTask',
				keyField: 'id',
				emptyMessage: 'タスクがありません',
				columns: [
					{ key: 'id', label: 'ID' },
					{
						key: 'title',
						label: 'タスク名',
						sortable: true,
						filter: { type: 'text', placeholder: 'タスク検索...' },
					},
					{
						key: 'status',
						label: 'ステータス',
						sortable: true,
						filter: {
							type: 'select',
							options: [
								{ value: '完了', label: '完了' },
								{ value: '進行中', label: '進行中' },
								{ value: '未着手', label: '未着手' },
								{ value: 'レビュー中', label: 'レビュー中' },
							],
						},
					},
					{
						key: 'priority',
						label: '優先度',
						sortable: true,
						filter: {
							type: 'select',
							options: [
								{ value: '高', label: '高' },
								{ value: '中', label: '中' },
								{ value: '低', label: '低' },
							],
						},
					},
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

		// --- Add Dialog ---
		addDialog: {
			type: 'Dialog',
			props: { title: 'タスク追加' },
			visible: { expr: '$state.showAddDialog' },
			children: ['addForm'],
		},
		addForm: {
			type: 'Stack',
			props: { gap: 4 },
			children: [
				'addTitle',
				'addStatusPriorityRow',
				'addAssignee',
				'addDateEstimateRow',
				'addActions',
			],
		},
		addTitle: {
			type: 'TextInput',
			props: {
				label: 'タスク名',
				placeholder: 'タスク名を入力',
				value: '$expr(state.newTask?.title ?? "")',
				onChange: '$action.setNewTitle',
			},
		},
		addStatusPriorityRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4 },
			children: ['addStatus', 'addPriority'],
		},
		addStatus: {
			type: 'Select',
			props: {
				label: 'ステータス',
				options: [
					{ value: '未着手', label: '未着手' },
					{ value: '進行中', label: '進行中' },
					{ value: 'レビュー中', label: 'レビュー中' },
					{ value: '完了', label: '完了' },
				],
				value: '$expr(state.newTask?.status ?? "未着手")',
				onChange: '$action.setNewStatus',
			},
		},
		addPriority: {
			type: 'Select',
			props: {
				label: '優先度',
				options: [
					{ value: '高', label: '高' },
					{ value: '中', label: '中' },
					{ value: '低', label: '低' },
				],
				value: '$expr(state.newTask?.priority ?? "中")',
				onChange: '$action.setNewPriority',
			},
		},
		addAssignee: {
			type: 'TextInput',
			props: {
				label: '担当者',
				placeholder: '担当者名を入力',
				value: '$expr(state.newTask?.assignee ?? "")',
				onChange: '$action.setNewAssignee',
			},
		},
		addDateEstimateRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4 },
			children: ['addDueDate', 'addEstimate'],
		},
		addDueDate: {
			type: 'TextInput',
			props: {
				label: '期限',
				type: 'date',
				value: '$expr(state.newTask?.dueDate ?? "")',
				onChange: '$action.setNewDueDate',
			},
		},
		addEstimate: {
			type: 'TextInput',
			props: {
				label: '見積 (pt)',
				type: 'number',
				placeholder: '0',
				value: '$expr(state.newTask?.estimate ?? "")',
				onChange: '$action.setNewEstimate',
			},
		},
		addActions: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 2, justify: 'end' },
			children: ['addCancelBtn', 'addSubmitBtn'],
		},
		addCancelBtn: {
			type: 'Button',
			props: {
				label: 'キャンセル',
				variant: 'secondary',
				onClick: '$action.closeAddDialog',
			},
		},
		addSubmitBtn: {
			type: 'Button',
			props: {
				label: '追加',
				variant: 'primary',
				onClick: '$action.addTask',
			},
		},

		// --- Edit Dialog ---
		editDialog: {
			type: 'Dialog',
			props: { title: 'タスク編集' },
			visible: { expr: '$state.showEditDialog' },
			children: ['editForm'],
		},
		editForm: {
			type: 'Stack',
			props: { gap: 4 },
			children: [
				'editTitle',
				'editStatusPriorityRow',
				'editAssignee',
				'editDateEstimateRow',
				'editActions',
			],
		},
		editTitle: {
			type: 'TextInput',
			props: {
				label: 'タスク名',
				value: '$expr(state.editingTask?.title ?? "")',
				onChange: '$action.setEditTitle',
			},
		},
		editStatusPriorityRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4 },
			children: ['editStatus', 'editPriority'],
		},
		editStatus: {
			type: 'Select',
			props: {
				label: 'ステータス',
				options: [
					{ value: '未着手', label: '未着手' },
					{ value: '進行中', label: '進行中' },
					{ value: 'レビュー中', label: 'レビュー中' },
					{ value: '完了', label: '完了' },
				],
				value: '$expr(state.editingTask?.status ?? "")',
				onChange: '$action.setEditStatus',
			},
		},
		editPriority: {
			type: 'Select',
			props: {
				label: '優先度',
				options: [
					{ value: '高', label: '高' },
					{ value: '中', label: '中' },
					{ value: '低', label: '低' },
				],
				value: '$expr(state.editingTask?.priority ?? "")',
				onChange: '$action.setEditPriority',
			},
		},
		editAssignee: {
			type: 'TextInput',
			props: {
				label: '担当者',
				value: '$expr(state.editingTask?.assignee ?? "")',
				onChange: '$action.setEditAssignee',
			},
		},
		editDateEstimateRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4 },
			children: ['editDueDate', 'editEstimate'],
		},
		editDueDate: {
			type: 'TextInput',
			props: {
				label: '期限',
				type: 'date',
				value: '$expr(state.editingTask?.dueDate ?? "")',
				onChange: '$action.setEditDueDate',
			},
		},
		editEstimate: {
			type: 'TextInput',
			props: {
				label: '見積 (pt)',
				type: 'number',
				value: '$expr(state.editingTask?.estimate ?? "")',
				onChange: '$action.setEditEstimate',
			},
		},
		editActions: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 2, justify: 'end' },
			children: ['editDeleteBtn', 'editCancelBtn', 'editSubmitBtn'],
		},
		editDeleteBtn: {
			type: 'Button',
			props: {
				label: '削除',
				variant: 'danger',
				onClick: '$action.openDeleteConfirm',
			},
		},
		editCancelBtn: {
			type: 'Button',
			props: {
				label: 'キャンセル',
				variant: 'secondary',
				onClick: '$action.closeEditDialog',
			},
		},
		editSubmitBtn: {
			type: 'Button',
			props: {
				label: '保存',
				variant: 'primary',
				onClick: '$action.updateTask',
			},
		},

		// --- Delete Confirm Dialog ---
		deleteConfirmDialog: {
			type: 'Dialog',
			props: { title: 'タスク削除の確認' },
			visible: { expr: '$state.showDeleteConfirm' },
			children: ['deleteConfirmContent'],
		},
		deleteConfirmContent: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['deleteConfirmText', 'deleteConfirmActions'],
		},
		deleteConfirmText: {
			type: 'Text',
			props: {
				content: 'このタスクを削除しますか？この操作は取り消せません。',
			},
		},
		deleteConfirmActions: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 2, justify: 'end' },
			children: ['deleteCancelBtn', 'deleteConfirmBtn'],
		},
		deleteCancelBtn: {
			type: 'Button',
			props: {
				label: 'キャンセル',
				variant: 'secondary',
				onClick: '$action.closeDeleteConfirm',
			},
		},
		deleteConfirmBtn: {
			type: 'Button',
			props: {
				label: '削除',
				variant: 'danger',
				onClick: '$action.deleteTask',
			},
		},
	},
	state: {
		showAddDialog: false,
		newTask: null,
		editingTask: null,
		showEditDialog: false,
		showDeleteConfirm: false,
	},
	actions: {
		// Add
		openAddDialog: {
			type: 'setState',
			key: 'showAddDialog',
			value: true,
			onComplete: {
				newTask: { title: '', status: '未着手', priority: '中', assignee: '', dueDate: '', estimate: 0 },
			},
		},
		closeAddDialog: {
			type: 'setState',
			key: 'showAddDialog',
			value: false,
			onComplete: { newTask: null },
		},
		setNewTitle: { type: 'setState', key: 'newTask.title' },
		setNewStatus: { type: 'setState', key: 'newTask.status' },
		setNewPriority: { type: 'setState', key: 'newTask.priority' },
		setNewAssignee: { type: 'setState', key: 'newTask.assignee' },
		setNewDueDate: { type: 'setState', key: 'newTask.dueDate' },
		setNewEstimate: { type: 'setState', key: 'newTask.estimate' },
		addTask: {
			type: 'addItem',
			hookId: 'tasks',
			stateKey: 'newTask',
			idPrefix: 'TASK',
			onComplete: { showAddDialog: false, newTask: null },
		},

		// Edit
		selectTask: {
			type: 'setState',
			key: 'editingTask',
			onComplete: { showEditDialog: true },
		},
		closeEditDialog: {
			type: 'setState',
			key: 'showEditDialog',
			value: false,
			onComplete: { editingTask: null },
		},
		setEditTitle: { type: 'setState', key: 'editingTask.title' },
		setEditStatus: { type: 'setState', key: 'editingTask.status' },
		setEditPriority: { type: 'setState', key: 'editingTask.priority' },
		setEditAssignee: { type: 'setState', key: 'editingTask.assignee' },
		setEditDueDate: { type: 'setState', key: 'editingTask.dueDate' },
		setEditEstimate: { type: 'setState', key: 'editingTask.estimate' },
		updateTask: {
			type: 'updateItem',
			hookId: 'tasks',
			key: 'id',
			stateKey: 'editingTask',
			onComplete: { showEditDialog: false, editingTask: null },
		},

		// Delete
		openDeleteConfirm: { type: 'setState', key: 'showDeleteConfirm', value: true },
		closeDeleteConfirm: { type: 'setState', key: 'showDeleteConfirm', value: false },
		deleteTask: {
			type: 'removeItem',
			hookId: 'tasks',
			key: 'id',
			stateKey: 'editingTask',
			onComplete: { showDeleteConfirm: false, showEditDialog: false, editingTask: null },
		},
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'task-management', 'crud'],
	},
};

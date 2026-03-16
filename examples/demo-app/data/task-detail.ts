import type { PageSpec } from '@viyv/agent-ui-schema';

export const taskDetailSpec: PageSpec = {
	id: 'task-detail',
	title: 'タスク詳細',
	description:
		'Badge, Alert, Link, Divider の新コンポーネントを活用したタスク詳細画面。タスクボードから rowHref で遷移。',
	hooks: {
		task: {
			use: 'useState',
			params: {
				initial: {
					id: 'TASK-002',
					title: 'ダッシュボードUIデザイン',
					status: '進行中',
					priority: '高',
					assignee: '佐藤 花子',
					dueDate: '2026-03-15',
					estimate: 13,
					description:
						'売上ダッシュボードのUI刷新。レスポンシブ対応、グラフ追加、フィルタ機能の実装を含む。デザインシステムに準拠した統一的なUIを構築する。',
					createdAt: '2026-03-01',
					updatedAt: '2026-03-14',
				},
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: [
				'backLink',
				'header',
				'statusAlert',
				'infoCard',
				'divider1',
				'descCard',
				'divider2',
				'metaCard',
				'footerLinks',
			],
		},
		backLink: {
			type: 'Link',
			props: {
				href: '/pages/task-board',
				label: '\u2190 タスクボードに戻る',
			},
		},
		header: {
			type: 'Header',
			props: {
				title: '$hook.task.title',
				subtitle: '$hook.task.id',
			},
		},
		statusAlert: {
			type: 'Alert',
			props: {
				type: 'warning',
				title: 'ステータス: 進行中',
				message: 'このタスクは現在作業中です。期限は 2026/3/15 です。',
			},
		},
		infoCard: {
			type: 'Card',
			props: { title: '基本情報' },
			children: ['infoGrid'],
		},
		infoGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 4 },
			children: ['statusBadgeCard', 'priorityBadgeCard', 'assigneeField', 'estimateField'],
		},
		statusBadgeCard: {
			type: 'Stack',
			props: { gap: 1 },
			children: ['statusLabel', 'statusBadge'],
		},
		statusLabel: {
			type: 'Text',
			props: { content: 'ステータス' },
		},
		statusBadge: {
			type: 'Badge',
			props: {
				text: '$hook.task.status',
				color: 'blue',
			},
		},
		priorityBadgeCard: {
			type: 'Stack',
			props: { gap: 1 },
			children: ['priorityLabel', 'priorityBadge'],
		},
		priorityLabel: {
			type: 'Text',
			props: { content: '優先度' },
		},
		priorityBadge: {
			type: 'Badge',
			props: {
				text: '$hook.task.priority',
				color: 'red',
			},
		},
		assigneeField: {
			type: 'Stat',
			props: { label: '担当者', value: '$hook.task.assignee' },
		},
		estimateField: {
			type: 'Stat',
			props: { label: '見積ポイント', value: '$hook.task.estimate', format: 'number' },
		},
		divider1: {
			type: 'Divider',
			props: {},
		},
		descCard: {
			type: 'Card',
			props: { title: '説明' },
			children: ['descText'],
		},
		descText: {
			type: 'Text',
			props: { content: '$hook.task.description' },
		},
		divider2: {
			type: 'Divider',
			props: {},
		},
		metaCard: {
			type: 'Card',
			props: { title: 'メタ情報' },
			children: ['metaGrid'],
		},
		metaGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 4 },
			children: ['createdField', 'updatedField'],
		},
		createdField: {
			type: 'Stat',
			props: { label: '作成日', value: '$hook.task.createdAt' },
		},
		updatedField: {
			type: 'Stat',
			props: { label: '更新日', value: '$hook.task.updatedAt' },
		},
		footerLinks: {
			type: 'Stack',
			props: { gap: 2 },
			children: ['footerDivider', 'footerLinkRow'],
		},
		footerDivider: {
			type: 'Divider',
			props: {},
		},
		footerLinkRow: {
			type: 'Grid',
			props: { columns: 2, gap: 4 },
			children: ['linkToBoard', 'linkExternal'],
		},
		linkToBoard: {
			type: 'Link',
			props: {
				href: '/pages/task-board',
				label: 'タスクボード',
			},
		},
		linkExternal: {
			type: 'Link',
			props: {
				href: 'https://github.com',
				label: 'GitHub で確認 (外部リンク)',
				external: true,
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'task-detail', 'badge', 'alert', 'link', 'divider'],
	},
};

import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * チケット詳細 デモページ
 * 検証: Timeline (ドット+線+$item.xxx), ProgressBar, Avatar, Badge, submitForm
 */
export const ticketDetailPmSpec: PageSpec = {
	id: 'ticket-detail-pm',
	title: 'チケット詳細',
	description: 'Timeline レンダラーを使ったチケット詳細画面デモ',
	hooks: {
		ticket: {
			use: 'useState',
			params: {
				initial: {
					id: 'BL-005',
					title: 'ダッシュボードグラフ実装',
					status: '進行中',
					priority: '高',
					assignee: '鈴木花子',
					reporter: '田中太郎',
					sprint: 'Sprint 3',
					category: 'UI',
					estimate: 13,
					dueDate: '2026-03-25',
					progress: 60,
					description:
						'売上ダッシュボードにグラフコンポーネントを追加する。BarChart、LineChart、PieChart の3種を実装し、リアルタイムデータ表示に対応する。レスポンシブ対応も含む。',
				},
			},
		},
		activities: {
			use: 'useState',
			params: {
				initial: [
					{ id: 'act-1', type: '作成', author: '田中太郎', timestamp: '2026-03-10 09:00', content: 'チケットを作成しました。Sprint 3 のダッシュボード改善として起票。' },
					{ id: 'act-2', type: 'コメント', author: '高橋翔太', timestamp: '2026-03-10 10:30', content: 'BarChart は Recharts を使う方針で良いですか？パフォーマンスの観点から確認したいです。' },
					{ id: 'act-3', type: 'コメント', author: '田中太郎', timestamp: '2026-03-10 11:00', content: 'Recharts で問題ありません。既存プロジェクトでも使用実績があります。' },
					{ id: 'act-4', type: 'ステータス変更', author: '鈴木花子', timestamp: '2026-03-12 09:00', content: 'ステータスを「ToDo」→「進行中」に変更しました。' },
					{ id: 'act-5', type: 'コメント', author: '鈴木花子', timestamp: '2026-03-12 14:00', content: 'BarChart の基本実装が完了しました。XAxis/YAxis のフォーマットも対応済みです。' },
					{ id: 'act-6', type: 'コメント', author: '山田美咲', timestamp: '2026-03-13 10:00', content: 'デザインレビューしました。色のコントラストを改善してほしいです。WCAG AA 準拠を目標に。' },
					{ id: 'act-7', type: 'コメント', author: '鈴木花子', timestamp: '2026-03-14 09:00', content: 'LineChart も実装完了。色のコントラスト修正も反映しました。' },
					{ id: 'act-8', type: 'コメント', author: '渡辺大輝', timestamp: '2026-03-14 15:00', content: 'テスト環境で確認しました。大量データ（1000件）でもスムーズに描画されています。' },
					{ id: 'act-9', type: 'コメント', author: '鈴木花子', timestamp: '2026-03-15 09:00', content: 'PieChart の実装に着手します。自動カラーリングの仕組みを追加予定。' },
					{ id: 'act-10', type: 'コメント', author: '中村さくら', timestamp: '2026-03-16 11:00', content: 'アクセシビリティの観点から、各チャートに aria-label を付けてください。スクリーンリーダー対応が必要です。' },
					{ id: 'act-11', type: 'コメント', author: '鈴木花子', timestamp: '2026-03-17 09:00', content: 'aria-label 対応しました。ChartContainer コンポーネントで一括管理しています。PieChart も実装完了で進捗 60% です。' },
				],
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['backLink', 'headerRow', 'infoCard', 'progressCard', 'descCard', 'activityCard', 'commentCard'],
		},
		backLink: {
			type: 'Link',
			props: { href: '/pages/backlog', label: '\u2190 バックログに戻る' },
		},
		headerRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 12, align: 'center' },
			children: ['ticketTitle', 'statusBadge', 'priorityBadge'],
		},
		ticketTitle: {
			type: 'Header',
			props: { title: '$hook.ticket.title', subtitle: '$hook.ticket.id', level: 1 },
		},
		statusBadge: {
			type: 'Badge',
			props: { text: '$hook.ticket.status', color: 'blue' },
		},
		priorityBadge: {
			type: 'Badge',
			props: { text: '$hook.ticket.priority', color: 'red' },
		},
		infoCard: {
			type: 'Card',
			props: { title: 'チケット情報' },
			children: ['infoGrid'],
		},
		infoGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['assigneeInfo', 'reporterInfo', 'sprintStat', 'categoryStat', 'estimateStat', 'dueDateStat'],
		},
		assigneeInfo: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center' },
			children: ['assigneeAvatar', 'assigneeStack'],
		},
		assigneeAvatar: {
			type: 'Avatar',
			props: { name: '$hook.ticket.assignee', size: 'md' },
		},
		assigneeStack: {
			type: 'Stack',
			props: { gap: 2 },
			children: ['assigneeLabel', 'assigneeName'],
		},
		assigneeLabel: {
			type: 'Text',
			props: { content: '担当者', size: 'xs', color: 'muted' },
		},
		assigneeName: {
			type: 'Text',
			props: { content: '$hook.ticket.assignee', weight: 'medium' },
		},
		reporterInfo: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center' },
			children: ['reporterAvatar', 'reporterStack'],
		},
		reporterAvatar: {
			type: 'Avatar',
			props: { name: '$hook.ticket.reporter', size: 'md' },
		},
		reporterStack: {
			type: 'Stack',
			props: { gap: 2 },
			children: ['reporterLabel', 'reporterName'],
		},
		reporterLabel: {
			type: 'Text',
			props: { content: '報告者', size: 'xs', color: 'muted' },
		},
		reporterName: {
			type: 'Text',
			props: { content: '$hook.ticket.reporter', weight: 'medium' },
		},
		sprintStat: {
			type: 'Stat',
			props: { label: 'Sprint', value: '$hook.ticket.sprint' },
		},
		categoryStat: {
			type: 'Stat',
			props: { label: 'カテゴリ', value: '$hook.ticket.category' },
		},
		estimateStat: {
			type: 'Stat',
			props: { label: '見積ポイント', value: '$hook.ticket.estimate', format: 'number' },
		},
		dueDateStat: {
			type: 'Stat',
			props: { label: '期限', value: '$hook.ticket.dueDate' },
		},
		progressCard: {
			type: 'Card',
			props: { title: 'タスク進捗' },
			children: ['taskProgress'],
		},
		taskProgress: {
			type: 'ProgressBar',
			props: {
				value: '$hook.ticket.progress',
				size: 'lg',
				showValue: true,
				color: 'blue',
				label: 'タスク進捗',
			},
		},
		descCard: {
			type: 'Card',
			props: { title: '説明' },
			children: ['descText'],
		},
		descText: {
			type: 'Text',
			props: { content: '$hook.ticket.description' },
		},
		activityCard: {
			type: 'Card',
			props: { title: 'アクティビティ' },
			children: ['timeline'],
		},
		timeline: {
			type: 'Timeline',
			props: {
				data: '$hook.activities',
				keyField: 'id',
				labelKey: 'author',
				timestampKey: 'timestamp',
			},
			children: ['activityItem'],
		},
		activityItem: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['activityMeta', 'activityContent'],
		},
		activityMeta: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center', wrap: true },
			children: ['activityAvatar', 'activityAuthor', 'activityTypeBadge'],
		},
		activityAvatar: {
			type: 'Avatar',
			props: { name: '$item.author', size: 'sm' },
		},
		activityAuthor: {
			type: 'Text',
			props: { content: '$item.author', weight: 'medium', size: 'sm' },
		},
		activityTypeBadge: {
			type: 'Badge',
			props: {
				text: '$item.type',
				color: '$expr(item.type === "ステータス変更" ? "yellow" : item.type === "作成" ? "green" : "gray")',
			},
		},
		activityContent: {
			type: 'Text',
			props: { content: '$item.content', size: 'sm', color: 'muted' },
		},
		commentCard: {
			type: 'Card',
			props: { title: 'コメントを追加' },
			children: ['commentForm'],
		},
		commentForm: {
			type: 'Stack',
			props: { gap: 12 },
			children: ['commentInput', 'commentSubmit', 'commentResult'],
		},
		commentInput: {
			type: 'Textarea',
			props: {
				placeholder: 'コメントを入力...',
				rows: 3,
				value: '$bindState.newComment',
				onChange: '$action.setComment',
			},
		},
		commentSubmit: {
			type: 'Button',
			props: {
				label: 'コメントを投稿',
				variant: 'primary',
				onClick: '$action.submitComment',
				disabled: '$expr(state.newComment.trim().length === 0)',
			},
		},
		commentResult: {
			type: 'Alert',
			props: {
				message: '$expr(state.submitResult?.message ?? "")',
				type: '$expr(state.submitResult?.success ? "success" : "error")',
				title: '$expr(state.submitResult?.success ? "投稿完了" : "エラー")',
			},
			visible: { expr: 'state.submitResult != null' },
		},
	},
	state: {
		newComment: '',
		submitResult: null,
	},
	actions: {
		setComment: { type: 'setState', key: 'newComment' },
		submitComment: {
			type: 'submitForm',
			url: '/api/comment',
			method: 'POST',
			stateKey: 'submitResult',
			onComplete: { newComment: '' },
		},
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'ticket', 'timeline', 'progress-bar', 'avatar', 'badge'],
	},
};

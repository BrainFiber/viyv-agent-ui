import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * オーバーレイ＆フィードバック デモ
 * 検証: Dialog, AlertDialog, Drawer, Popover, HoverCard, Toast, ToastContainer,
 *       Tooltip, Skeleton, Spinner, Progress, Empty, Alert, Tabs
 */
export const overlayFeedbackSpec: PageSpec = {
	id: 'overlay-feedback',
	title: 'オーバーレイ＆フィードバック',
	description: 'ダイアログ、ドロワー、トースト、ローディング状態のデモ',
	hooks: {},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'tabs', 'toastContainer'],
		},

		/* ── ページヘッダー ── */
		header: {
			type: 'Header',
			props: { title: 'オーバーレイ＆フィードバック', subtitle: 'ダイアログ、ドロワー、トースト、ローディング状態のデモ' },
		},

		/* ── タブ ── */
		tabs: {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'overlay', label: 'オーバーレイ' },
					{ id: 'loading', label: 'ローディング' },
					{ id: 'alerts', label: 'アラート' },
				],
			},
			children: ['overlayTab', 'loadingTab', 'alertsTab'],
		},

		/* ==============================
		 * オーバーレイ タブ
		 * ============================== */
		overlayTab: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['overlayGrid', 'toastButton'],
		},
		overlayGrid: {
			type: 'Grid',
			props: { columns: 3, gap: 16 },
			children: ['dialogCard', 'alertDialogCard', 'drawerCard', 'popoverCard', 'hoverCardCard', 'tooltipCard'],
		},

		/* Dialog */
		dialogCard: {
			type: 'Card',
			props: { title: 'Dialog' },
			children: ['dialogBtn', 'dialog'],
		},
		dialogBtn: {
			type: 'Button',
			props: { label: 'ダイアログを開く', variant: 'primary', onClick: '$action.openDialog' },
		},
		dialog: {
			type: 'Dialog',
			props: { title: '確認', open: '$state.dialogOpen' },
			children: ['dialogContent'],
			visible: { expr: '$state.dialogOpen' },
		},
		dialogContent: {
			type: 'Text',
			props: { content: 'これはダイアログのコンテンツです。任意のコンポーネントを配置できます。' },
		},

		/* AlertDialog */
		alertDialogCard: {
			type: 'Card',
			props: { title: 'AlertDialog' },
			children: ['alertDialogBtn', 'alertDialog'],
		},
		alertDialogBtn: {
			type: 'Button',
			props: { label: '削除確認', variant: 'primary', onClick: '$action.openAlertDialog' },
		},
		alertDialog: {
			type: 'AlertDialog',
			props: {
				title: '本当に削除しますか？',
				description: 'この操作は元に戻すことができません。すべてのデータが完全に削除されます。',
				variant: 'destructive',
				confirmLabel: '削除する',
				cancelLabel: 'キャンセル',
				open: '$state.alertDialogOpen',
				onConfirm: '$action.closeAlertDialog',
				onCancel: '$action.closeAlertDialog',
			},
			visible: { expr: '$state.alertDialogOpen' },
		},

		/* Drawer */
		drawerCard: {
			type: 'Card',
			props: { title: 'Drawer' },
			children: ['drawerBtn', 'drawer'],
		},
		drawerBtn: {
			type: 'Button',
			props: { label: 'ドロワーを開く', variant: 'primary', onClick: '$action.openDrawer' },
		},
		drawer: {
			type: 'Drawer',
			props: {
				title: '詳細情報',
				position: 'right',
				open: '$state.drawerOpen',
				onClose: '$action.closeDrawer',
			},
			children: ['drawerContent'],
			visible: { expr: '$state.drawerOpen' },
		},
		drawerContent: {
			type: 'Stack',
			props: { gap: 12 },
			children: ['drawerText1', 'drawerText2'],
		},
		drawerText1: {
			type: 'Text',
			props: { content: 'ドロワーの中にはリッチなコンテンツを配置できます。', variant: 'body' },
		},
		drawerText2: {
			type: 'Text',
			props: { content: 'フォーム、リスト、テーブルなど、あらゆるコンポーネントが利用可能です。', variant: 'body', color: 'muted' },
		},

		/* Popover */
		popoverCard: {
			type: 'Card',
			props: { title: 'Popover' },
			children: ['popover'],
		},
		popover: {
			type: 'Popover',
			props: { trigger: 'ポップオーバーを表示', side: 'bottom' },
			children: ['popoverContent'],
		},
		popoverContent: {
			type: 'Stack',
			props: { gap: 8 },
			children: ['popoverTitle', 'popoverDesc'],
		},
		popoverTitle: {
			type: 'Text',
			props: { content: '設定パネル', weight: 'semibold', size: 'sm' },
		},
		popoverDesc: {
			type: 'Text',
			props: { content: 'ここにフォームやオプションを配置できます。', size: 'sm', color: 'muted' },
		},

		/* HoverCard */
		hoverCardCard: {
			type: 'Card',
			props: { title: 'HoverCard' },
			children: ['hoverCardDemo'],
		},
		hoverCardDemo: {
			type: 'HoverCard',
			props: { content: '田中太郎 — フロントエンドエンジニア。React / TypeScript が得意分野。2023年入社。' },
			children: ['hoverCardTrigger'],
		},
		hoverCardTrigger: {
			type: 'Text',
			props: { content: '@tanaka_taro にホバーしてください', size: 'sm' },
		},

		/* Tooltip */
		tooltipCard: {
			type: 'Card',
			props: { title: 'Tooltip' },
			children: ['tooltipStack'],
		},
		tooltipStack: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 12 },
			children: ['tooltipTop', 'tooltipBottom', 'tooltipLeft', 'tooltipRight'],
		},
		tooltipTop: {
			type: 'Tooltip',
			props: { content: '上に表示', position: 'top' },
			children: ['tooltipTopBtn'],
		},
		tooltipTopBtn: {
			type: 'Button',
			props: { label: '上', variant: 'secondary', size: 'sm' },
		},
		tooltipBottom: {
			type: 'Tooltip',
			props: { content: '下に表示', position: 'bottom' },
			children: ['tooltipBottomBtn'],
		},
		tooltipBottomBtn: {
			type: 'Button',
			props: { label: '下', variant: 'secondary', size: 'sm' },
		},
		tooltipLeft: {
			type: 'Tooltip',
			props: { content: '左に表示', position: 'left' },
			children: ['tooltipLeftBtn'],
		},
		tooltipLeftBtn: {
			type: 'Button',
			props: { label: '左', variant: 'secondary', size: 'sm' },
		},
		tooltipRight: {
			type: 'Tooltip',
			props: { content: '右に表示', position: 'right' },
			children: ['tooltipRightBtn'],
		},
		tooltipRightBtn: {
			type: 'Button',
			props: { label: '右', variant: 'secondary', size: 'sm' },
		},

		/* Toast ボタン */
		toastButton: {
			type: 'Button',
			props: { label: 'トーストを表示', variant: 'primary', onClick: '$action.showToast' },
		},

		/* ToastContainer */
		toastContainer: {
			type: 'ToastContainer',
			props: { position: 'top-right' },
		},

		/* ==============================
		 * ローディング タブ
		 * ============================== */
		loadingTab: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['skeletonCard', 'spinnerCard', 'progressCard', 'emptyCard'],
		},

		/* Skeleton */
		skeletonCard: {
			type: 'Card',
			props: { title: 'Skeleton' },
			children: ['skeletonStack'],
		},
		skeletonStack: {
			type: 'Stack',
			props: { gap: 12 },
			children: ['skeletonText', 'skeletonCircle', 'skeletonRect'],
		},
		skeletonText: {
			type: 'Skeleton',
			props: { variant: 'text', lines: 3 },
		},
		skeletonCircle: {
			type: 'Skeleton',
			props: { variant: 'circle', width: 48 },
		},
		skeletonRect: {
			type: 'Skeleton',
			props: { variant: 'rect', height: 80 },
		},

		/* Spinner */
		spinnerCard: {
			type: 'Card',
			props: { title: 'Spinner' },
			children: ['spinnerStack'],
		},
		spinnerStack: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 24, align: 'center' },
			children: ['spinnerSm', 'spinnerMd', 'spinnerLg'],
		},
		spinnerSm: {
			type: 'Spinner',
			props: { size: 'sm', label: 'Small' },
		},
		spinnerMd: {
			type: 'Spinner',
			props: { size: 'md', label: 'Medium' },
		},
		spinnerLg: {
			type: 'Spinner',
			props: { size: 'lg', label: 'Large' },
		},

		/* Progress */
		progressCard: {
			type: 'Card',
			props: { title: 'Progress' },
			children: ['progressBar'],
		},
		progressBar: {
			type: 'Progress',
			props: { value: 65, size: 'lg', showValue: true, color: 'blue', label: 'アップロード進捗' },
		},

		/* Empty */
		emptyCard: {
			type: 'Card',
			props: { title: 'Empty' },
			children: ['emptyState'],
		},
		emptyState: {
			type: 'Empty',
			props: { icon: 'inbox', title: 'データがありません', description: '新しいアイテムを追加してください。' },
		},

		/* ==============================
		 * アラート タブ
		 * ============================== */
		alertsTab: {
			type: 'Stack',
			props: { gap: 12 },
			children: ['alertInfo', 'alertSuccess', 'alertWarning', 'alertError'],
		},
		alertInfo: {
			type: 'Alert',
			props: { type: 'info', title: '情報', message: 'システムメンテナンスを 3/25 0:00〜6:00 に実施します。' },
		},
		alertSuccess: {
			type: 'Alert',
			props: { type: 'success', title: '成功', message: 'プロフィールが正常に更新されました。' },
		},
		alertWarning: {
			type: 'Alert',
			props: { type: 'warning', title: '警告', message: 'ストレージ使用量が 90% に達しています。不要なファイルを削除してください。' },
		},
		alertError: {
			type: 'Alert',
			props: { type: 'error', title: 'エラー', message: 'データの保存に失敗しました。ネットワーク接続を確認してください。', closable: true },
		},
	},
	state: {
		dialogOpen: false,
		alertDialogOpen: false,
		drawerOpen: false,
		showToast: false,
	},
	actions: {
		openDialog: { type: 'setState', key: 'dialogOpen', value: true },
		closeDialog: { type: 'setState', key: 'dialogOpen', value: false },
		openAlertDialog: { type: 'setState', key: 'alertDialogOpen', value: true },
		closeAlertDialog: { type: 'setState', key: 'alertDialogOpen', value: false },
		openDrawer: { type: 'setState', key: 'drawerOpen', value: true },
		closeDrawer: { type: 'setState', key: 'drawerOpen', value: false },
		showToast: { type: 'setState', key: 'showToast', value: true },
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'overlay', 'feedback', 'dialog', 'drawer', 'toast', 'alert', 'skeleton', 'spinner'],
	},
};

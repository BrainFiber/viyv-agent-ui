import type { PageSpec } from '@viyv/agent-ui-schema';

export const animationShowcaseSpec: PageSpec = {
	id: 'animation-showcase',
	title: 'アニメーション・ショーケース',
	description: 'Motion (framer-motion) で実装したアニメーションのデモ。Dialog, Drawer, Toast, Tooltip, Collapse, Tabs の動作を確認できます。',
	tags: ['demo', 'animation', 'motion', 'dialog', 'drawer', 'toast', 'collapse', 'tabs'],
	theme: {},
	root: 'root',
	state: {
		showDialog: false,
		showDrawer: false,
		showToastSuccess: false,
		showToastError: false,
	},
	actions: {
		openDialog: { type: 'setState', key: 'showDialog', value: true },
		closeDialog: { type: 'setState', key: 'showDialog', value: false },
		openDrawer: { type: 'setState', key: 'showDrawer', value: true },
		closeDrawer: { type: 'setState', key: 'showDrawer', value: false },
		openToastSuccess: { type: 'setState', key: 'showToastSuccess', value: true },
		openToastError: { type: 'setState', key: 'showToastError', value: true },
	},
	hooks: {},
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 8 },
			children: [
				'header',
				'section-overlay',
				'section-collapse',
				'section-tabs',
				'section-tooltip',
				'dialog-overlay',
				'drawer-overlay',
				'toast-success',
				'toast-error',
			],
		},
		header: {
			type: 'Header',
			props: { level: 1, text: 'アニメーション・ショーケース' },
		},

		// ── Overlay section ──
		'section-overlay': {
			type: 'Card',
			props: { title: 'Overlay アニメーション' },
			children: ['overlay-desc', 'overlay-buttons'],
		},
		'overlay-desc': {
			type: 'Text',
			props: { content: 'Dialog / Drawer / Toast は enter + exit アニメーションで滑らかに表示・非表示されます。ボタンをクリックして確認してください。' },
		},
		'overlay-buttons': {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 3 },
			children: ['btn-dialog', 'btn-drawer', 'btn-toast-success', 'btn-toast-error'],
		},
		'btn-dialog': {
			type: 'Button',
			props: { label: 'Dialog を開く', variant: 'primary', onClick: '$action.openDialog' },
		},
		'btn-drawer': {
			type: 'Button',
			props: { label: 'Drawer を開く', variant: 'secondary', onClick: '$action.openDrawer' },
		},
		'btn-toast-success': {
			type: 'Button',
			props: { label: 'Toast (成功)', variant: 'secondary', onClick: '$action.openToastSuccess' },
		},
		'btn-toast-error': {
			type: 'Button',
			props: { label: 'Toast (エラー)', variant: 'secondary', onClick: '$action.openToastError' },
		},

		// ── Dialog ──
		'dialog-overlay': {
			type: 'Dialog',
			props: { title: '確認ダイアログ' },
			visible: { expr: '$state.showDialog' },
			children: ['dialog-content', 'dialog-close-btn'],
		},
		'dialog-content': {
			type: 'Text',
			props: { content: 'これは Motion で実装された Dialog です。scale + fade のスムーズな enter/exit アニメーションで表示されます。「閉じる」ボタンを押すとアニメーション付きで閉じます。' },
		},
		'dialog-close-btn': {
			type: 'Button',
			props: { label: '閉じる', variant: 'primary', onClick: '$action.closeDialog' },
		},

		// ── Drawer ──
		'drawer-overlay': {
			type: 'Drawer',
			props: { title: 'サイドパネル', position: 'right', width: 420 },
			visible: { expr: '$state.showDrawer' },
			children: ['drawer-content', 'drawer-list', 'drawer-close-btn'],
		},
		'drawer-content': {
			type: 'Text',
			props: { content: 'Drawer はスライドイン / スライドアウトのアニメーションで表示されます。' },
		},
		'drawer-list': {
			type: 'List',
			props: {
				data: [
					{ label: 'アカウント設定', secondary: 'プロフィールとセキュリティ' },
					{ label: '通知設定', secondary: 'メール・プッシュ通知の管理' },
					{ label: 'テーマ設定', secondary: 'ダークモード・カラー' },
					{ label: 'データエクスポート', secondary: 'CSV・JSON ダウンロード' },
				],
				avatarKey: 'label',
			},
		},
		'drawer-close-btn': {
			type: 'Button',
			props: { label: '閉じる', variant: 'secondary', onClick: '$action.closeDrawer' },
		},

		// ── Toasts ──
		'toast-success': {
			type: 'Toast',
			props: { message: '保存に成功しました！', type: 'success', position: 'top-right', duration: 3000 },
			visible: { expr: '$state.showToastSuccess' },
		},
		'toast-error': {
			type: 'Toast',
			props: { message: 'エラーが発生しました。もう一度お試しください。', type: 'error', position: 'top-right', duration: 4000 },
			visible: { expr: '$state.showToastError' },
		},

		// ── Collapse section ──
		'section-collapse': {
			type: 'Card',
			props: { title: 'Collapse アニメーション' },
			children: ['collapse-desc', 'collapse-demo'],
		},
		'collapse-desc': {
			type: 'Text',
			props: { content: 'Collapse は height: 0 → auto の滑らかなアニメーションで展開・折りたたみされます。以前は即時表示/非表示でした。' },
		},
		'collapse-demo': {
			type: 'Collapse',
			props: {
				panels: [
					{ id: 'p1', title: 'プロジェクト概要' },
					{ id: 'p2', title: 'メンバー一覧' },
					{ id: 'p3', title: 'スケジュール' },
				],
				defaultOpen: ['p1'],
			},
			children: ['collapse-content-1', 'collapse-content-2', 'collapse-content-3'],
		},
		'collapse-content-1': {
			type: 'Stack',
			props: { gap: 3 },
			children: ['collapse-1-text', 'collapse-1-progress'],
		},
		'collapse-1-text': {
			type: 'Text',
			props: { content: 'viyv-agent-ui は AI エージェントが操作するための UI フレームワークです。宣言的な PageSpec で UI を定義し、React コンポーネントでレンダリングします。' },
		},
		'collapse-1-progress': {
			type: 'ProgressBar',
			props: { value: 68, max: 100, label: 'プロジェクト進捗', showValue: true, color: 'blue' },
		},
		'collapse-content-2': {
			type: 'List',
			props: {
				data: [
					{ label: '田中 太郎', secondary: 'プロダクトマネージャー' },
					{ label: '鈴木 花子', secondary: 'フロントエンドエンジニア' },
					{ label: '山田 一郎', secondary: 'バックエンドエンジニア' },
				],
				avatarKey: 'label',
			},
		},
		'collapse-content-3': {
			type: 'Grid',
			props: { columns: 3, gap: 4 },
			children: ['stat-start', 'stat-end', 'stat-remaining'],
		},
		'stat-start': {
			type: 'Stat',
			props: { label: '開始日', value: '2026-01-15' },
		},
		'stat-end': {
			type: 'Stat',
			props: { label: '終了予定', value: '2026-06-30' },
		},
		'stat-remaining': {
			type: 'Stat',
			props: { label: '残り日数', value: '99日', trend: 'down', trendLabel: '-3日' },
		},

		// ── Tabs section ──
		'section-tabs': {
			type: 'Card',
			props: { title: 'Tabs クロスフェード' },
			children: ['tabs-desc', 'tabs-demo'],
		},
		'tabs-desc': {
			type: 'Text',
			props: { content: 'タブ切り替え時にコンテンツが fade アニメーションで切り替わります。' },
		},
		'tabs-demo': {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'overview', label: '概要' },
					{ id: 'chart', label: 'グラフ' },
					{ id: 'table', label: 'テーブル' },
				],
			},
			children: ['tab-overview', 'tab-chart', 'tab-table'],
		},
		'tab-overview': {
			type: 'Grid',
			props: { columns: 3, gap: 4 },
			children: ['stat-users', 'stat-revenue', 'stat-orders'],
		},
		'stat-users': {
			type: 'Stat',
			props: { label: 'アクティブユーザー', value: '12,450', trend: 'up', trendLabel: '+8.2%' },
		},
		'stat-revenue': {
			type: 'Stat',
			props: { label: '月間売上', value: '¥4,580,000', trend: 'up', trendLabel: '+12.5%' },
		},
		'stat-orders': {
			type: 'Stat',
			props: { label: '注文数', value: '3,842', trend: 'down', trendLabel: '-2.1%' },
		},
		'tab-chart': {
			type: 'BarChart',
			props: {
				title: '月別売上推移',
				data: [
					{ month: '1月', sales: 3200000 },
					{ month: '2月', sales: 3800000 },
					{ month: '3月', sales: 4580000 },
				],
				xKey: 'month',
				yKeys: ['sales'],
			},
		},
		'tab-table': {
			type: 'DataTable',
			props: {
				data: [
					{ id: 'ORD-001', customer: '田中商事', amount: 125000, status: '完了' },
					{ id: 'ORD-002', customer: '鈴木工業', amount: 340000, status: '出荷中' },
					{ id: 'ORD-003', customer: '山田電機', amount: 89000, status: '処理中' },
					{ id: 'ORD-004', customer: '佐藤建設', amount: 560000, status: '完了' },
					{ id: 'ORD-005', customer: '高橋物流', amount: 210000, status: 'キャンセル' },
				],
				columns: [
					{ key: 'id', label: '注文ID' },
					{ key: 'customer', label: '顧客名' },
					{ key: 'amount', label: '金額', format: 'currency', sortable: true },
					{ key: 'status', label: 'ステータス', format: 'badge', badgeMap: { '完了': 'green', '出荷中': 'blue', '処理中': 'yellow', 'キャンセル': 'red' } },
				],
				keyField: 'id',
			},
		},

		// ── Tooltip section ──
		'section-tooltip': {
			type: 'Card',
			props: { title: 'Tooltip アニメーション' },
			children: ['tooltip-desc', 'tooltip-row'],
		},
		'tooltip-desc': {
			type: 'Text',
			props: { content: 'ホバー時に Tooltip が opacity アニメーションで表示されます。各ボタンにマウスを乗せてみてください。' },
		},
		'tooltip-row': {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 3 },
			children: ['tooltip-1', 'tooltip-2', 'tooltip-3'],
		},
		'tooltip-1': {
			type: 'Tooltip',
			props: { content: '上に表示される Tooltip', position: 'top' },
			children: ['tooltip-btn-1'],
		},
		'tooltip-btn-1': {
			type: 'Button',
			props: { label: 'Top', variant: 'secondary' },
		},
		'tooltip-2': {
			type: 'Tooltip',
			props: { content: '下に表示される Tooltip', position: 'bottom' },
			children: ['tooltip-btn-2'],
		},
		'tooltip-btn-2': {
			type: 'Button',
			props: { label: 'Bottom', variant: 'secondary' },
		},
		'tooltip-3': {
			type: 'Tooltip',
			props: { content: '右に表示される Tooltip', position: 'right' },
			children: ['tooltip-btn-3'],
		},
		'tooltip-btn-3': {
			type: 'Button',
			props: { label: 'Right', variant: 'secondary' },
		},
	},
};

import type { PageSpec } from '@viyv/agent-ui-schema';

export const iconShowcaseSpec: PageSpec = {
	id: 'icon-showcase',
	title: 'アイコン・ショーケース',
	description: 'Lucide React で統一されたアイコンのデモ。Alert, Empty, Spinner, Carousel, Stepper, DataTable, TreeList, Collapse, Menu, Pagination で使用されるアイコンを確認できます。',
	meta: { tags: ['demo', 'icons', 'lucide'] },
	root: 'root',
	state: {},
	actions: {},
	hooks: {},
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 8 },
			children: [
				'header',
				'section-status',
				'section-empty',
				'section-loading',
				'section-navigation',
				'section-data',
				'section-collapse-menu',
			],
		},
		header: {
			type: 'Header',
			props: { level: 1, text: 'アイコン・ショーケース' },
		},

		// ── Status Icons (Alert) ──
		'section-status': {
			type: 'Card',
			props: { title: 'ステータスアイコン — Alert' },
			children: ['status-desc', 'status-grid'],
		},
		'status-desc': {
			type: 'Text',
			props: { content: 'Alert コンポーネントは type に応じて Info, CircleCheck, TriangleAlert, CircleX アイコンを表示します。閉じるボタンには X アイコンが使われます。' },
		},
		'status-grid': {
			type: 'Stack',
			props: { gap: 3 },
			children: ['alert-info', 'alert-success', 'alert-warning', 'alert-error'],
		},
		'alert-info': {
			type: 'Alert',
			props: { type: 'info', title: 'Info', message: 'Info アイコン — 情報を伝えるメッセージです。', closable: true },
		},
		'alert-success': {
			type: 'Alert',
			props: { type: 'success', title: 'Success', message: 'CircleCheck アイコン — 成功を示すメッセージです。', closable: true },
		},
		'alert-warning': {
			type: 'Alert',
			props: { type: 'warning', title: 'Warning', message: 'TriangleAlert アイコン — 注意を促すメッセージです。', closable: true },
		},
		'alert-error': {
			type: 'Alert',
			props: { type: 'error', title: 'Error', message: 'CircleX アイコン — エラーを伝えるメッセージです。', closable: true },
		},

		// ── Empty State Icons ──
		'section-empty': {
			type: 'Card',
			props: { title: '空状態アイコン — Empty' },
			children: ['empty-desc', 'empty-grid'],
		},
		'empty-desc': {
			type: 'Text',
			props: { content: 'Empty コンポーネントは icon prop で Inbox, Search, TriangleAlert, Folder アイコンを切り替えます。' },
		},
		'empty-grid': {
			type: 'Grid',
			props: { columns: 4, gap: 4 },
			children: ['empty-inbox', 'empty-search', 'empty-error', 'empty-folder'],
		},
		'empty-inbox': {
			type: 'Empty',
			props: { title: 'Inbox', description: 'icon="inbox"', icon: 'inbox' },
		},
		'empty-search': {
			type: 'Empty',
			props: { title: 'Search', description: 'icon="search"', icon: 'search' },
		},
		'empty-error': {
			type: 'Empty',
			props: { title: 'Error', description: 'icon="error"', icon: 'error' },
		},
		'empty-folder': {
			type: 'Empty',
			props: { title: 'Folder', description: 'icon="folder"', icon: 'folder' },
		},

		// ── Loading Icons ──
		'section-loading': {
			type: 'Card',
			props: { title: 'ローディングアイコン — Spinner & Button' },
			children: ['loading-desc', 'loading-row'],
		},
		'loading-desc': {
			type: 'Text',
			props: { content: 'Loader2 アイコンに animate-spin を適用。Spinner は sm/md/lg のサイズバリエーション、Button は loading 状態で表示します。' },
		},
		'loading-row': {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 6 },
			children: ['spinner-sm', 'spinner-md', 'spinner-lg', 'btn-loading'],
		},
		'spinner-sm': {
			type: 'Spinner',
			props: { size: 'sm', label: 'Small' },
		},
		'spinner-md': {
			type: 'Spinner',
			props: { size: 'md', label: 'Medium' },
		},
		'spinner-lg': {
			type: 'Spinner',
			props: { size: 'lg', label: 'Large' },
		},
		'btn-loading': {
			type: 'Button',
			props: { label: '送信中...', loading: true, variant: 'primary' },
		},

		// ── Navigation Icons ──
		'section-navigation': {
			type: 'Card',
			props: { title: 'ナビゲーションアイコン — Stepper, Carousel, Pagination' },
			children: ['nav-desc', 'stepper-demo', 'carousel-demo', 'pagination-demo'],
		},
		'nav-desc': {
			type: 'Text',
			props: { content: 'Stepper は完了ステップに Check アイコン、Carousel は ChevronLeft/ChevronRight、Pagination も ChevronLeft/ChevronRight を使用します。' },
		},
		'stepper-demo': {
			type: 'Stepper',
			props: {
				steps: [
					{ label: 'アカウント作成', description: '完了済み' },
					{ label: 'プロフィール設定', description: '完了済み' },
					{ label: '確認', description: '現在のステップ' },
				],
				current: 2,
			},
		},
		'carousel-demo': {
			type: 'Carousel',
			props: { showArrows: true, showDots: true },
			children: ['slide-1', 'slide-2', 'slide-3'],
		},
		'slide-1': {
			type: 'Card',
			props: { title: 'スライド 1' },
			children: ['slide-1-text'],
		},
		'slide-1-text': {
			type: 'Text',
			props: { content: 'ChevronLeft / ChevronRight アイコンで前後のスライドに移動します。' },
		},
		'slide-2': {
			type: 'Card',
			props: { title: 'スライド 2' },
			children: ['slide-2-text'],
		},
		'slide-2-text': {
			type: 'Text',
			props: { content: '矢印キー (← →) でも操作できます。' },
		},
		'slide-3': {
			type: 'Card',
			props: { title: 'スライド 3' },
			children: ['slide-3-text'],
		},
		'slide-3-text': {
			type: 'Text',
			props: { content: '3枚目のスライドです。' },
		},
		'pagination-demo': {
			type: 'Stack',
			props: { gap: 2 },
			children: ['pagination-label'],
		},
		'pagination-label': {
			type: 'Text',
			props: { content: '※ Pagination アイコンはデータ一覧ページ（例: EC 商品一覧）で確認できます。' },
		},

		// ── Data Icons (DataTable, TreeList) ──
		'section-data': {
			type: 'Card',
			props: { title: 'データアイコン — DataTable & TreeList' },
			children: ['data-desc', 'data-table-demo', 'tree-list-demo'],
		},
		'data-desc': {
			type: 'Text',
			props: { content: 'DataTable のソートカラムには ArrowUp/ArrowDown アイコン、TreeList の展開/折り畳みには ChevronDown/ChevronRight、リーフノードには Dot アイコンが使われます。' },
		},
		'data-table-demo': {
			type: 'DataTable',
			props: {
				data: [
					{ id: 1, name: 'Lucide', type: 'アイコン', stars: 12500 },
					{ id: 2, name: 'Motion', type: 'アニメーション', stars: 25000 },
					{ id: 3, name: 'Tailwind', type: 'CSS', stars: 85000 },
				],
				columns: [
					{ key: 'name', label: 'ライブラリ', sortable: true },
					{ key: 'type', label: 'カテゴリ' },
					{ key: 'stars', label: 'GitHub Stars', sortable: true },
				],
				keyField: 'id',
			},
		},
		'tree-list-demo': {
			type: 'TreeList',
			props: {
				data: [
					{
						id: 'src',
						label: 'src/',
						children: [
							{
								id: 'lib',
								label: 'lib/',
								children: [
									{ id: 'icons', label: 'icons.ts' },
									{ id: 'cn', label: 'cn.ts' },
								],
							},
							{
								id: 'display',
								label: 'display/',
								children: [
									{ id: 'alert', label: 'alert.tsx' },
									{ id: 'spinner', label: 'spinner.tsx' },
								],
							},
						],
					},
				],
				defaultExpanded: true,
			},
		},

		// ── Collapse & Menu ──
		'section-collapse-menu': {
			type: 'Card',
			props: { title: 'Collapse & Menu — ChevronDown アイコン' },
			children: ['collapse-menu-desc', 'collapse-menu-row'],
		},
		'collapse-menu-desc': {
			type: 'Text',
			props: { content: 'Collapse パネルと Menu のサブメニューは ChevronDown アイコンで展開/折り畳み状態を示します。rotate-180 で回転します。' },
		},
		'collapse-menu-row': {
			type: 'Grid',
			props: { columns: 2, gap: 4 },
			children: ['collapse-demo', 'menu-demo'],
		},
		'collapse-demo': {
			type: 'Collapse',
			props: {
				panels: [
					{ id: 'p1', title: 'Lucide React とは' },
					{ id: 'p2', title: 'インストール方法' },
					{ id: 'p3', title: '使い方' },
				],
				defaultOpen: ['p1'],
			},
			children: ['collapse-c1', 'collapse-c2', 'collapse-c3'],
		},
		'collapse-c1': {
			type: 'Text',
			props: { content: 'Lucide React は 1,500+ のアイコンを提供する tree-shakeable な React アイコンライブラリです。shadcn/ui、Vercel、Linear で採用されています。' },
		},
		'collapse-c2': {
			type: 'Text',
			props: { content: 'pnpm add lucide-react でインストールし、import { IconName } from "lucide-react" で使用します。' },
		},
		'collapse-c3': {
			type: 'Text',
			props: { content: '<IconName className="h-5 w-5" /> のように props でサイズやスタイルを指定できます。strokeWidth でアイコンの太さも調整可能です。' },
		},
		'menu-demo': {
			type: 'Menu',
			props: {
				items: [
					{ label: 'ダッシュボード', icon: '📊', href: '#', active: true },
					{ label: 'プロジェクト', icon: '📁', items: [
						{ label: 'viyv-agent-ui', href: '#' },
						{ label: 'その他', href: '#' },
					] },
					{ label: '設定', icon: '⚙️', items: [
						{ label: 'プロフィール', href: '#' },
						{ label: 'テーマ', href: '#' },
					] },
				],
				direction: 'vertical',
			},
		},
	},
};

import type { PageSpec } from '@viyv/agent-ui-schema';

const inventory = [
	{ id: 'P001', name: 'ウィジェットA', category: '部品', price: 1200, stock: 150, minStock: 50, warehouse: '東京倉庫', lastRestocked: '2026-03-10' },
	{ id: 'P002', name: 'ガジェットB', category: '完成品', price: 4500, stock: 80, minStock: 30, warehouse: '大阪倉庫', lastRestocked: '2026-03-08' },
	{ id: 'P003', name: 'コネクタC', category: '部品', price: 800, stock: 300, minStock: 100, warehouse: '東京倉庫', lastRestocked: '2026-03-12' },
	{ id: 'P004', name: 'モジュールD', category: '完成品', price: 8900, stock: 12, minStock: 20, warehouse: '名古屋倉庫', lastRestocked: '2026-02-20' },
	{ id: 'P005', name: 'センサーE', category: '部品', price: 2200, stock: 120, minStock: 40, warehouse: '福岡倉庫', lastRestocked: '2026-03-05' },
	{ id: 'P006', name: 'アダプタF', category: 'アクセサリ', price: 1500, stock: 200, minStock: 60, warehouse: '東京倉庫', lastRestocked: '2026-03-11' },
	{ id: 'P007', name: 'レギュレータG', category: '部品', price: 3400, stock: 8, minStock: 30, warehouse: '大阪倉庫', lastRestocked: '2026-02-15' },
	{ id: 'P008', name: 'トランスミッターH', category: '完成品', price: 12000, stock: 3, minStock: 10, warehouse: '東京倉庫', lastRestocked: '2026-02-28' },
	{ id: 'P009', name: 'バルブI', category: '部品', price: 950, stock: 0, minStock: 25, warehouse: '名古屋倉庫', lastRestocked: '2026-01-30' },
	{ id: 'P010', name: 'ケーブルJ', category: 'アクセサリ', price: 600, stock: 500, minStock: 100, warehouse: '福岡倉庫', lastRestocked: '2026-03-14' },
	{ id: 'P011', name: 'リレーK', category: '部品', price: 1800, stock: 45, minStock: 50, warehouse: '東京倉庫', lastRestocked: '2026-03-01' },
	{ id: 'P012', name: 'コントローラL', category: '完成品', price: 15000, stock: 18, minStock: 15, warehouse: '大阪倉庫', lastRestocked: '2026-03-09' },
];

export const inventorySpec: PageSpec = {
	id: 'inventory',
	title: '在庫管理',
	description:
		'在庫数と最低在庫数の比較、在庫切れ/在庫少の視覚的警告、数値フィルタの限界を検証。',
	hooks: {
		items: {
			use: 'useState',
			params: { initial: inventory },
		},
		itemCount: {
			use: 'useDerived',
			from: 'items',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
		totalValue: {
			use: 'useDerived',
			from: 'items',
			params: { aggregate: { fn: 'sum', key: 'price' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'stockAlert', 'statsGrid', 'tableCard'],
		},
		header: {
			type: 'Header',
			props: {
				title: '在庫管理',
				subtitle: '倉庫別・カテゴリ別の在庫状況',
			},
		},
		stockAlert: {
			type: 'Alert',
			props: {
				type: 'error',
				title: '在庫不足アラート',
				message: 'モジュールD (12個 / 最低20), レギュレータG (8個 / 最低30), トランスミッターH (3個 / 最低10), バルブI (0個 / 最低25), リレーK (45個 / 最低50) — 発注が必要です。',
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 3, gap: 4 },
			children: ['statItems', 'statLowStock', 'statOutOfStock'],
		},
		statItems: {
			type: 'Stat',
			props: { label: '商品数', value: '$hook.itemCount', format: 'number' },
		},
		statLowStock: {
			type: 'Badge',
			props: { text: '在庫不足: 5件', color: 'yellow' },
		},
		statOutOfStock: {
			type: 'Badge',
			props: { text: '在庫切れ: 1件', color: 'red' },
		},
		tableCard: {
			type: 'Card',
			props: { title: '在庫一覧' },
			children: ['inventoryTable'],
		},
		inventoryTable: {
			type: 'DataTable',
			props: {
				data: '$hook.items',
				keyField: 'id',
				emptyMessage: '商品がありません',
				rowHighlight: [
					{ key: 'stock', op: 'eq', value: 0, className: 'bg-red-50' },
					{ key: 'stock', op: 'lt', field: 'minStock', className: 'bg-yellow-50' },
				],
				columns: [
					{ key: 'id', label: '商品ID' },
					{ key: 'name', label: '商品名', sortable: true, filter: { type: 'text', placeholder: '商品検索...' } },
					{
						key: 'category',
						label: 'カテゴリ',
						sortable: true,
						filter: { type: 'select' },
					},
					{ key: 'price', label: '単価', sortable: true, format: 'currency' },
					{ key: 'stock', label: '在庫数', sortable: true, format: 'number' },
					{ key: 'minStock', label: '最低在庫', sortable: true, format: 'number' },
					{
						key: 'warehouse',
						label: '倉庫',
						sortable: true,
						filter: { type: 'select' },
					},
					{ key: 'lastRestocked', label: '最終入庫', sortable: true, format: 'date' },
				],
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'inventory', 'filter-test'],
	},
};

import type { PageSpec } from '@viyv/agent-ui-schema';
import { datasets } from '../lib/demo-data';

/**
 * EC商品一覧ページ
 * 検証: Grid レスポンシブ (#3), Image (#4), rowHref + searchParams (#6), DataTable minWidth (#7)
 */
export const ecProductListSpec: PageSpec = {
	id: 'ec-product-list',
	title: 'EC 商品一覧',
	description:
		'商品マスタの一覧表示。Gridレスポンシブ、Image表示、rowHrefによる詳細遷移を検証。',
	hooks: {
		products: {
			use: 'useState',
			params: { initial: datasets.products.rows },
		},
		productCount: {
			use: 'useDerived',
			from: 'products',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
		byCategoryCount: {
			use: 'useDerived',
			from: 'products',
			params: { groupBy: 'category', aggregate: { fn: 'count', key: 'category' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'heroImage', 'statsGrid', 'categoryCard', 'tableCard'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'EC 商品一覧',
				subtitle: '商品マスタ管理 — 行クリックで詳細へ遷移',
			},
		},
		heroImage: {
			type: 'Image',
			props: {
				src: 'https://placehold.co/800x200/e2e8f0/64748b?text=Product+Catalog',
				alt: '商品カタログバナー',
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 3, gap: 16 },
			children: ['statProductCount', 'statCategories', 'statAvgPrice'],
		},
		statProductCount: {
			type: 'Stat',
			props: { label: '商品数', value: '$hook.productCount', format: 'number' },
		},
		statCategories: {
			type: 'Stat',
			props: { label: 'カテゴリ数', value: 3 },
		},
		statAvgPrice: {
			type: 'Stat',
			props: { label: '平均単価', value: 4312, format: 'currency' },
		},
		categoryCard: {
			type: 'Card',
			props: { title: 'カテゴリ別商品数' },
			children: ['categoryChart'],
		},
		categoryChart: {
			type: 'PieChart',
			props: {
				data: '$hook.byCategoryCount',
				nameKey: 'category',
				valueKey: 'category_count',
				title: 'カテゴリ分布',
			},
		},
		tableCard: {
			type: 'Card',
			props: { title: '商品一覧' },
			children: ['productTable'],
		},
		productTable: {
			type: 'DataTable',
			props: {
				data: '$hook.products',
				keyField: 'id',
				rowHref: '/pages/ec-product-detail?id={{id}}',
				columns: [
					{ key: 'id', label: '商品ID', minWidth: 80 },
					{ key: 'name', label: '商品名', sortable: true, filter: { type: 'text', placeholder: '商品検索...' } },
					{ key: 'category', label: 'カテゴリ', sortable: true, filter: { type: 'select' } },
					{ key: 'price', label: '単価', sortable: true, format: 'currency' },
					{ key: 'stock', label: '在庫数', sortable: true, format: 'number' },
				],
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'ec', 'product', 'image', 'responsive', 'rowHref'],
	},
};

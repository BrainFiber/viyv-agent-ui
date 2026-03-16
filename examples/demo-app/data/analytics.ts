import type { PageSpec } from '@viyv/agent-ui-schema';
import { datasets } from '../lib/demo-data';

/**
 * アナリティクスページ
 * 検証: groupBy衝突修正 (#1), BarChart X軸 (#2), PieChart凡例 (#10),
 *       Tabs (#5), Stat trend color (#9), Grid レスポンシブ (#3)
 */
export const analyticsSpec: PageSpec = {
	id: 'analytics',
	title: 'アナリティクス',
	description:
		'groupBy+aggregate 衝突修正、チャートラベル正常化、Tabs切替、Stat trend color を検証。',
	hooks: {
		salesData: {
			use: 'useState',
			params: { initial: datasets.sales.rows },
		},
		// groupBy "region" + aggregate count on "region" => region_count (衝突リネーム #1)
		byRegion: {
			use: 'useDerived',
			from: 'salesData',
			params: { groupBy: 'region', aggregate: { fn: 'count', key: 'region' } },
		},
		// groupBy "product" + aggregate sum on "amount" => no collision
		byProduct: {
			use: 'useDerived',
			from: 'salesData',
			params: { groupBy: 'product', aggregate: { fn: 'sum', key: 'amount' } },
		},
		// groupBy "product" + aggregate count on "product" => product_count (衝突リネーム)
		productCount: {
			use: 'useDerived',
			from: 'salesData',
			params: { groupBy: 'product', aggregate: { fn: 'count', key: 'product' } },
		},
		totalSales: {
			use: 'useDerived',
			from: 'salesData',
			params: { aggregate: { fn: 'sum', key: 'amount' } },
		},
		salesCount: {
			use: 'useDerived',
			from: 'salesData',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'statsGrid', 'tabs'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'アナリティクス',
				subtitle: '売上データの多角的分析',
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 4, gap: 16 },
			children: ['statTotal', 'statCount', 'statUp', 'statDown'],
		},
		statTotal: {
			type: 'Stat',
			props: {
				label: '総売上',
				value: '$hook.totalSales',
				format: 'currency',
				trend: { direction: 'up', value: '+12.5%' },
			},
		},
		statCount: {
			type: 'Stat',
			props: {
				label: '取引件数',
				value: '$hook.salesCount',
				format: 'number',
				trend: { direction: 'up', value: '+8件' },
			},
		},
		statUp: {
			type: 'Stat',
			props: {
				label: 'CPU使用率',
				value: 0.35,
				format: 'percent',
				trend: { direction: 'down', value: '-15%', color: 'green' },
			},
		},
		statDown: {
			type: 'Stat',
			props: {
				label: 'エラー率',
				value: 0.02,
				format: 'percent',
				trend: { direction: 'up', value: '+0.5%', color: 'red' },
			},
		},
		tabs: {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'region', label: '地域別' },
					{ id: 'product-sales', label: '商品別売上' },
					{ id: 'product-count', label: '商品別件数' },
				],
			},
			children: ['regionPanel', 'productSalesPanel', 'productCountPanel'],
		},
		// Tab 1: 地域別
		regionPanel: {
			type: 'Stack',
			props: { gap: 16 },
			children: ['regionChartGrid'],
		},
		regionChartGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['regionBarCard', 'regionPieCard'],
		},
		regionBarCard: {
			type: 'Card',
			props: { title: '地域別取引数 (BarChart)' },
			children: ['regionBarChart'],
		},
		regionBarChart: {
			type: 'BarChart',
			props: {
				data: '$hook.byRegion',
				xKey: 'region',
				yKey: 'region_count',
				title: '地域別取引数',
				color: '#3b82f6',
			},
		},
		regionPieCard: {
			type: 'Card',
			props: { title: '地域別取引数 (PieChart)' },
			children: ['regionPieChart'],
		},
		regionPieChart: {
			type: 'PieChart',
			props: {
				data: '$hook.byRegion',
				nameKey: 'region',
				valueKey: 'region_count',
				title: '地域別取引割合',
			},
		},
		// Tab 2: 商品別売上
		productSalesPanel: {
			type: 'Card',
			props: { title: '商品別売上金額' },
			children: ['productBarChart'],
		},
		productBarChart: {
			type: 'BarChart',
			props: {
				data: '$hook.byProduct',
				xKey: 'product',
				yKey: 'amount',
				title: '商品別売上',
				color: '#10b981',
			},
		},
		// Tab 3: 商品別件数
		productCountPanel: {
			type: 'Card',
			props: { title: '商品別取引件数' },
			children: ['productCountChart'],
		},
		productCountChart: {
			type: 'BarChart',
			props: {
				data: '$hook.productCount',
				xKey: 'product',
				yKey: 'product_count',
				title: '商品別取引件数',
				color: '#f59e0b',
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'analytics', 'tabs', 'groupBy-collision', 'trend-color'],
	},
};

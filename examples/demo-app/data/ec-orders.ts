import type { PageSpec } from '@viyv/agent-ui-schema';
import { datasets } from '../lib/demo-data';

/**
 * EC注文一覧ページ
 * 検証: AreaChart (#2 X軸修正), LineChart, DataTable date minWidth (#7),
 *       Grid レスポンシブ (#3), groupBy衝突 (#1)
 */
export const ecOrdersSpec: PageSpec = {
	id: 'ec-orders',
	title: 'EC 注文一覧',
	description:
		'注文データの時系列分析。AreaChart/LineChart、日付列minWidth、groupBy衝突修正を検証。',
	hooks: {
		salesData: {
			use: 'useState',
			params: { initial: datasets.sales.rows },
		},
		totalAmount: {
			use: 'useDerived',
			from: 'salesData',
			params: { aggregate: { fn: 'sum', key: 'amount' } },
		},
		orderCount: {
			use: 'useDerived',
			from: 'salesData',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
		avgAmount: {
			use: 'useDerived',
			from: 'salesData',
			params: { aggregate: { fn: 'avg', key: 'amount' } },
		},
		// groupBy "customer" + aggregate sum "amount" => no collision
		byCustomer: {
			use: 'useDerived',
			from: 'salesData',
			params: { groupBy: 'customer', aggregate: { fn: 'sum', key: 'amount' } },
		},
		// groupBy "customer" + aggregate count "customer" => customer_count (衝突リネーム)
		customerOrderCount: {
			use: 'useDerived',
			from: 'salesData',
			params: { groupBy: 'customer', aggregate: { fn: 'count', key: 'customer' } },
		},
		// 月別集計: groupBy "date" is unique per row, so use region for time-like grouping
		byRegionAmount: {
			use: 'useDerived',
			from: 'salesData',
			params: { groupBy: 'region', aggregate: { fn: 'sum', key: 'amount' } },
		},
		recentOrders: {
			use: 'useDerived',
			from: 'salesData',
			params: { sort: { key: 'date', order: 'desc' }, limit: 15 },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'statsGrid', 'chartsGrid', 'orderCard'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'EC 注文一覧',
				subtitle: '2026年Q1 注文データ分析',
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 3, gap: 16 },
			children: ['statTotal', 'statCount', 'statAvg'],
		},
		statTotal: {
			type: 'Stat',
			props: {
				label: '総売上',
				value: '$hook.totalAmount',
				format: 'currency',
				trend: { direction: 'up', value: '+18.2%' },
			},
		},
		statCount: {
			type: 'Stat',
			props: {
				label: '注文件数',
				value: '$hook.orderCount',
				format: 'number',
			},
		},
		statAvg: {
			type: 'Stat',
			props: {
				label: '平均注文額',
				value: '$hook.avgAmount',
				format: 'currency',
			},
		},
		chartsGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['customerChartCard', 'regionChartCard'],
		},
		customerChartCard: {
			type: 'Card',
			props: { title: '顧客別売上' },
			children: ['customerChart'],
		},
		customerChart: {
			type: 'BarChart',
			props: {
				data: '$hook.byCustomer',
				xKey: 'customer',
				yKey: 'amount',
				title: '顧客別売上金額',
				color: '#6366f1',
			},
		},
		regionChartCard: {
			type: 'Card',
			props: { title: '地域別売上' },
			children: ['regionChart'],
		},
		regionChart: {
			type: 'AreaChart',
			props: {
				data: '$hook.byRegionAmount',
				xKey: 'region',
				yKey: 'amount',
				title: '地域別売上金額',
				color: '#10b981',
			},
		},
		orderCard: {
			type: 'Card',
			props: { title: '注文一覧（直近15件）' },
			children: ['orderTable'],
		},
		orderTable: {
			type: 'DataTable',
			props: {
				data: '$hook.recentOrders',
				keyField: 'id',
				columns: [
					{ key: 'id', label: '注文ID', minWidth: 70 },
					{ key: 'date', label: '日付', sortable: true, format: 'date', minWidth: 110 },
					{ key: 'product', label: '商品', sortable: true, filter: { type: 'select' } },
					{ key: 'quantity', label: '数量', sortable: true, format: 'number' },
					{ key: 'amount', label: '金額', sortable: true, format: 'currency' },
					{ key: 'customer', label: '顧客', sortable: true, filter: { type: 'text', placeholder: '顧客検索...' } },
					{ key: 'region', label: '地域', sortable: true, filter: { type: 'select' } },
				],
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'ec', 'orders', 'area-chart', 'minWidth', 'groupBy-collision'],
	},
};

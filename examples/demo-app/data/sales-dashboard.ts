import type { PageSpec } from '@viyv/agent-ui-schema';
import { datasets } from '../lib/demo-data';

export const salesDashboardSpec: PageSpec = {
	id: 'sales-dashboard',
	title: '売上ダッシュボード',
	description: '2026年Q1の売上分析ダッシュボード。useState + useDerived で集計・ソートを実現。',
	hooks: {
		salesData: {
			use: 'useState',
			params: { initial: datasets.sales.rows },
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
		avgSales: {
			use: 'useDerived',
			from: 'salesData',
			params: { aggregate: { fn: 'avg', key: 'amount' } },
		},
		sortedSales: {
			use: 'useDerived',
			from: 'salesData',
			params: { sort: { key: 'date', order: 'desc' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'statsGrid', 'tableCard'],
		},
		header: {
			type: 'Header',
			props: {
				title: '売上ダッシュボード',
				subtitle: '2026年 Q1 (1月〜3月)',
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 3, gap: 4 },
			children: ['statTotal', 'statCount', 'statAvg'],
		},
		statTotal: {
			type: 'Stat',
			props: {
				label: '総売上',
				value: '$hook.totalSales',
				format: 'currency',
			},
		},
		statCount: {
			type: 'Stat',
			props: {
				label: '取引件数',
				value: '$hook.salesCount',
			},
		},
		statAvg: {
			type: 'Stat',
			props: {
				label: '平均取引額',
				value: '$hook.avgSales',
				format: 'currency',
			},
		},
		tableCard: {
			type: 'Card',
			props: { title: '取引一覧' },
			children: ['salesTable'],
		},
		salesTable: {
			type: 'DataTable',
			props: {
				data: '$hook.sortedSales',
				columns: [
					{ key: 'date', label: '日付', sortable: true },
					{ key: 'product', label: '商品', sortable: true, filter: { type: 'select' } },
					{ key: 'quantity', label: '数量', sortable: true },
					{ key: 'amount', label: '金額', sortable: true },
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
		tags: ['demo', 'dashboard', 'sales'],
	},
};

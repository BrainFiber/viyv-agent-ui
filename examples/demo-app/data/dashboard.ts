import type { PageSpec } from '@viyv/agent-ui-schema';

export const dashboardSpec: PageSpec = {
	id: 'dashboard',
	title: '分析ダッシュボード',
	description: 'リアルタイムKPI、チャート、カレンダーを統合したマネジメントダッシュボード',
	hooks: {
		monthlySales: {
			use: 'useState',
			params: {
				initial: [
					{ month: '1月', amount: 980000 },
					{ month: '2月', amount: 1250000 },
					{ month: '3月', amount: 1120000 },
					{ month: '4月', amount: 1430000 },
					{ month: '5月', amount: 1380000 },
					{ month: '6月', amount: 1560000 },
					{ month: '7月', amount: 1620000 },
					{ month: '8月', amount: 1490000 },
					{ month: '9月', amount: 1710000 },
					{ month: '10月', amount: 1850000 },
					{ month: '11月', amount: 1920000 },
					{ month: '12月', amount: 2100000 },
				],
			},
		},
		categorySales: {
			use: 'useState',
			params: {
				initial: [
					{ category: '電子機器', amount: 4200000 },
					{ category: '衣料品', amount: 3100000 },
					{ category: '食品', amount: 2800000 },
					{ category: '書籍', amount: 1500000 },
					{ category: 'その他', amount: 745000 },
				],
			},
		},
		dailySales: {
			use: 'useState',
			params: {
				initial: [
					{ date: '3/1', amount: 420000 },
					{ date: '3/5', amount: 380000 },
					{ date: '3/10', amount: 510000 },
					{ date: '3/15', amount: 470000 },
					{ date: '3/20', amount: 630000 },
					{ date: '3/25', amount: 580000 },
					{ date: '3/30', amount: 720000 },
				],
			},
		},
		recentUsers: {
			use: 'useState',
			params: {
				initial: [
					{ name: '山田 太郎', email: 'yamada@example.com', date: '2026-03-20', status: 'アクティブ' },
					{ name: '鈴木 花子', email: 'suzuki@example.com', date: '2026-03-19', status: 'アクティブ' },
					{ name: '佐藤 健一', email: 'sato@example.com', date: '2026-03-18', status: '保留中' },
					{ name: '田中 美咲', email: 'tanaka@example.com', date: '2026-03-17', status: 'アクティブ' },
					{ name: '高橋 直人', email: 'takahashi@example.com', date: '2026-03-16', status: '非アクティブ' },
				],
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Container',
			props: { maxWidth: 1200 },
			children: ['mainStack'],
		},
		mainStack: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'kpiGrid', 'tabs', 'progressCard'],
		},
		header: {
			type: 'Header',
			props: { title: '分析ダッシュボード', subtitle: 'ビジネスKPIとトレンドの概要' },
		},

		// KPI Grid
		kpiGrid: {
			type: 'Grid',
			props: { columns: 4, gap: 4 },
			children: ['kpiSales', 'kpiUsers', 'kpiConversion', 'kpiSignups'],
		},
		kpiSales: {
			type: 'Card',
			props: { title: '売上' },
			children: ['statSales'],
		},
		statSales: {
			type: 'Stat',
			props: {
				label: '今月の売上',
				value: '¥12,345,000',
				trend: { direction: 'up', value: '+12.5%', color: 'green' },
			},
		},
		kpiUsers: {
			type: 'Card',
			props: { title: 'ユーザー' },
			children: ['statUsers'],
		},
		statUsers: {
			type: 'Stat',
			props: {
				label: 'アクティブユーザー',
				value: '8,234',
				trend: { direction: 'up', value: '+5.2%', color: 'green' },
			},
		},
		kpiConversion: {
			type: 'Card',
			props: { title: 'コンバージョン' },
			children: ['statConversion'],
		},
		statConversion: {
			type: 'Stat',
			props: {
				label: 'コンバージョン率',
				value: '3.2%',
				trend: { direction: 'down', value: '-0.4%', color: 'red' },
			},
		},
		kpiSignups: {
			type: 'Card',
			props: { title: '新規登録' },
			children: ['statSignups'],
		},
		statSignups: {
			type: 'Stat',
			props: {
				label: '新規登録',
				value: '1,423',
				trend: { direction: 'up', value: '+18.3%', color: 'green' },
			},
		},

		// Tabs
		tabs: {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'overview', label: '概要' },
					{ id: 'sales', label: '売上' },
					{ id: 'users', label: 'ユーザー' },
				],
			},
			children: ['overviewContent', 'salesContent', 'usersContent'],
		},
		overviewContent: {
			type: 'Grid',
			props: { columns: 2, gap: 4 },
			children: ['lineChartCard', 'pieChartCard'],
		},
		lineChartCard: {
			type: 'Card',
			props: { title: '月次売上推移' },
			children: ['lineChart'],
		},
		lineChart: {
			type: 'LineChart',
			props: {
				data: '$hook.monthlySales',
				xKey: 'month',
				yKey: 'amount',
				title: '月次売上推移',
			},
		},
		pieChartCard: {
			type: 'Card',
			props: { title: 'カテゴリ別売上' },
			children: ['pieChart'],
		},
		pieChart: {
			type: 'PieChart',
			props: {
				data: '$hook.categorySales',
				nameKey: 'category',
				valueKey: 'amount',
				title: 'カテゴリ別売上',
			},
		},
		salesContent: {
			type: 'Card',
			props: { title: '日次売上' },
			children: ['areaChart'],
		},
		areaChart: {
			type: 'AreaChart',
			props: {
				data: '$hook.dailySales',
				xKey: 'date',
				yKey: 'amount',
				title: '日次売上',
			},
		},
		usersContent: {
			type: 'Card',
			props: { title: '最近の登録ユーザー' },
			children: ['usersTable'],
		},
		usersTable: {
			type: 'DataTable',
			props: {
				data: '$hook.recentUsers',
				columns: [
					{ key: 'name', label: '名前', sortable: true },
					{ key: 'email', label: 'メール' },
					{ key: 'date', label: '登録日', sortable: true, format: 'date' },
					{
						key: 'status',
						label: 'ステータス',
						format: 'badge',
						badgeMap: {
							'アクティブ': 'green',
							'保留中': 'yellow',
							'非アクティブ': 'red',
						},
					},
				],
			},
		},

		// Progress
		progressCard: {
			type: 'Card',
			props: { title: '四半期目標' },
			children: ['progressStack'],
		},
		progressStack: {
			type: 'Stack',
			props: { gap: 2 },
			children: ['progressLabel', 'progressBar'],
		},
		progressLabel: {
			type: 'Text',
			props: { content: '四半期売上目標達成率: 72%' },
		},
		progressBar: {
			type: 'Progress',
			props: { value: 72, label: '四半期目標', color: 'blue', size: 'lg', showValue: true },
		},
	},
	state: {},
	actions: {},
	meta: { tags: ['dashboard', 'demo'] },
};

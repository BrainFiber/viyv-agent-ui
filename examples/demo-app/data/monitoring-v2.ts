import type { PageSpec } from '@viyv/agent-ui-schema';

const services = [
	{ name: 'api-gateway', status: 'healthy', cpu: 0.35, memory: 0.62, requests: 12500, errors: 3, p99: 120 },
	{ name: 'auth-service', status: 'healthy', cpu: 0.22, memory: 0.45, requests: 8900, errors: 0, p99: 45 },
	{ name: 'user-service', status: 'degraded', cpu: 0.78, memory: 0.85, requests: 6200, errors: 45, p99: 890 },
	{ name: 'order-service', status: 'healthy', cpu: 0.45, memory: 0.55, requests: 4500, errors: 2, p99: 200 },
	{ name: 'payment-service', status: 'healthy', cpu: 0.30, memory: 0.40, requests: 3200, errors: 1, p99: 150 },
	{ name: 'notification-svc', status: 'down', cpu: 0, memory: 0, requests: 0, errors: 0, p99: 0 },
	{ name: 'search-service', status: 'healthy', cpu: 0.55, memory: 0.70, requests: 9800, errors: 5, p99: 320 },
	{ name: 'report-service', status: 'degraded', cpu: 0.82, memory: 0.91, requests: 1200, errors: 120, p99: 4500 },
];

/**
 * モニタリング v2 ページ
 * 検証: Tabs (#5), Stat trend color (#9), Alert closable (#8),
 *       Grid レスポンシブ (#3), groupBy衝突 (#1)
 */
export const monitoringV2Spec: PageSpec = {
	id: 'monitoring-v2',
	title: 'サービスモニタリング',
	description:
		'マイクロサービスの稼働状況。Tabs切替、Stat trend color (down=green)、closable Alertを検証。',
	hooks: {
		services: {
			use: 'useState',
			params: { initial: services },
		},
		serviceCount: {
			use: 'useDerived',
			from: 'services',
			params: { aggregate: { fn: 'count', key: 'name' } },
		},
		avgCpu: {
			use: 'useDerived',
			from: 'services',
			params: { aggregate: { fn: 'avg', key: 'cpu' } },
		},
		avgMemory: {
			use: 'useDerived',
			from: 'services',
			params: { aggregate: { fn: 'avg', key: 'memory' } },
		},
		totalErrors: {
			use: 'useDerived',
			from: 'services',
			params: { aggregate: { fn: 'sum', key: 'errors' } },
		},
		// groupBy "status" + aggregate count "status" => status_count (衝突リネーム)
		byStatus: {
			use: 'useDerived',
			from: 'services',
			params: { groupBy: 'status', aggregate: { fn: 'count', key: 'status' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'downAlert', 'degradedAlert', 'statsGrid', 'tabs'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'サービスモニタリング',
				subtitle: 'マイクロサービス稼働状況ダッシュボード',
			},
		},
		downAlert: {
			type: 'Alert',
			props: {
				type: 'error',
				title: 'サービス停止',
				message: 'notification-svc が停止しています。',
				closable: true,
			},
		},
		degradedAlert: {
			type: 'Alert',
			props: {
				type: 'warning',
				title: 'パフォーマンス劣化',
				message: 'user-service, report-service でレスポンス遅延が発生中です。',
				closable: true,
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 4, gap: 16 },
			children: ['statServices', 'statCpu', 'statMemory', 'statErrors'],
		},
		statServices: {
			type: 'Stat',
			props: { label: 'サービス数', value: '$hook.serviceCount', format: 'number' },
		},
		statCpu: {
			type: 'Stat',
			props: {
				label: '平均CPU',
				value: '$hook.avgCpu',
				format: 'percent',
				trend: { direction: 'down', value: '-5%', color: 'green' },
			},
		},
		statMemory: {
			type: 'Stat',
			props: {
				label: '平均メモリ',
				value: '$hook.avgMemory',
				format: 'percent',
				trend: { direction: 'up', value: '+3%', color: 'red' },
			},
		},
		statErrors: {
			type: 'Stat',
			props: {
				label: '総エラー数',
				value: '$hook.totalErrors',
				format: 'number',
				trend: { direction: 'up', value: '+22', color: 'red' },
			},
		},
		tabs: {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'overview', label: '一覧' },
					{ id: 'status', label: 'ステータス分布' },
				],
			},
			children: ['overviewPanel', 'statusPanel'],
		},
		overviewPanel: {
			type: 'Card',
			props: { title: 'サービス一覧' },
			children: ['serviceTable'],
		},
		serviceTable: {
			type: 'DataTable',
			props: {
				data: '$hook.services',
				keyField: 'name',
				rowHighlight: [
					{ key: 'status', op: 'eq', value: 'down', className: 'bg-red-50' },
					{ key: 'status', op: 'eq', value: 'degraded', className: 'bg-yellow-50' },
				],
				columns: [
					{ key: 'name', label: 'サービス', sortable: true },
					{
						key: 'status',
						label: 'ステータス',
						sortable: true,
						format: 'badge',
						badgeMap: { healthy: 'green', degraded: 'yellow', down: 'red' },
						filter: { type: 'select' },
					},
					{ key: 'cpu', label: 'CPU', sortable: true, format: 'percent' },
					{ key: 'memory', label: 'メモリ', sortable: true, format: 'percent' },
					{ key: 'requests', label: 'リクエスト', sortable: true, format: 'number' },
					{ key: 'errors', label: 'エラー', sortable: true, format: 'number' },
					{ key: 'p99', label: 'P99(ms)', sortable: true, format: 'number', minWidth: 100 },
				],
			},
		},
		statusPanel: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['statusPieCard', 'statusBarCard'],
		},
		statusPieCard: {
			type: 'Card',
			props: { title: 'ステータス分布 (PieChart)' },
			children: ['statusPieChart'],
		},
		statusPieChart: {
			type: 'PieChart',
			props: {
				data: '$hook.byStatus',
				nameKey: 'status',
				valueKey: 'status_count',
				title: 'ステータス分布',
			},
		},
		statusBarCard: {
			type: 'Card',
			props: { title: 'ステータス分布 (BarChart)' },
			children: ['statusBarChart'],
		},
		statusBarChart: {
			type: 'BarChart',
			props: {
				data: '$hook.byStatus',
				xKey: 'status',
				yKey: 'status_count',
				title: 'ステータス別サービス数',
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'monitoring', 'tabs', 'trend-color', 'closable-alert', 'groupBy-collision'],
	},
};

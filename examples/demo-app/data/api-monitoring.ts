import type { PageSpec } from '@viyv/agent-ui-schema';

const apiLogs = [
	{ id: 1, timestamp: '2026-03-16 09:01:23', method: 'GET', endpoint: '/api/v1/users', statusCode: 200, responseMs: 45, bytes: 2340 },
	{ id: 2, timestamp: '2026-03-16 09:01:24', method: 'POST', endpoint: '/api/v1/users', statusCode: 201, responseMs: 120, bytes: 512 },
	{ id: 3, timestamp: '2026-03-16 09:01:25', method: 'GET', endpoint: '/api/v1/reports', statusCode: 200, responseMs: 890, bytes: 45200 },
	{ id: 4, timestamp: '2026-03-16 09:01:30', method: 'PUT', endpoint: '/api/v1/users/42', statusCode: 200, responseMs: 95, bytes: 380 },
	{ id: 5, timestamp: '2026-03-16 09:01:35', method: 'DELETE', endpoint: '/api/v1/sessions/old', statusCode: 204, responseMs: 30, bytes: 0 },
	{ id: 6, timestamp: '2026-03-16 09:02:01', method: 'GET', endpoint: '/api/v1/products', statusCode: 500, responseMs: 5200, bytes: 128 },
	{ id: 7, timestamp: '2026-03-16 09:02:05', method: 'POST', endpoint: '/api/v1/orders', statusCode: 422, responseMs: 60, bytes: 256 },
	{ id: 8, timestamp: '2026-03-16 09:02:10', method: 'GET', endpoint: '/api/v1/users', statusCode: 200, responseMs: 52, bytes: 2340 },
	{ id: 9, timestamp: '2026-03-16 09:02:15', method: 'GET', endpoint: '/api/v1/health', statusCode: 200, responseMs: 8, bytes: 64 },
	{ id: 10, timestamp: '2026-03-16 09:02:20', method: 'POST', endpoint: '/api/v1/auth/login', statusCode: 401, responseMs: 35, bytes: 128 },
	{ id: 11, timestamp: '2026-03-16 09:02:25', method: 'POST', endpoint: '/api/v1/auth/login', statusCode: 200, responseMs: 180, bytes: 512 },
	{ id: 12, timestamp: '2026-03-16 09:02:30', method: 'GET', endpoint: '/api/v1/reports/export', statusCode: 504, responseMs: 30000, bytes: 0 },
	{ id: 13, timestamp: '2026-03-16 09:03:00', method: 'PATCH', endpoint: '/api/v1/settings', statusCode: 200, responseMs: 75, bytes: 256 },
	{ id: 14, timestamp: '2026-03-16 09:03:05', method: 'GET', endpoint: '/api/v1/users?page=2', statusCode: 200, responseMs: 48, bytes: 2100 },
	{ id: 15, timestamp: '2026-03-16 09:03:10', method: 'POST', endpoint: '/api/v1/webhooks', statusCode: 429, responseMs: 12, bytes: 64 },
	{ id: 16, timestamp: '2026-03-16 09:03:15', method: 'GET', endpoint: '/api/v1/products', statusCode: 500, responseMs: 4800, bytes: 128 },
	{ id: 17, timestamp: '2026-03-16 09:03:20', method: 'GET', endpoint: '/api/v1/dashboard/stats', statusCode: 200, responseMs: 320, bytes: 1024 },
	{ id: 18, timestamp: '2026-03-16 09:03:25', method: 'PUT', endpoint: '/api/v1/users/42/avatar', statusCode: 413, responseMs: 15, bytes: 64 },
	{ id: 19, timestamp: '2026-03-16 09:03:30', method: 'GET', endpoint: '/api/v1/notifications', statusCode: 200, responseMs: 65, bytes: 4096 },
	{ id: 20, timestamp: '2026-03-16 09:03:35', method: 'POST', endpoint: '/api/v1/orders', statusCode: 201, responseMs: 150, bytes: 380 },
];

export const apiMonitoringSpec: PageSpec = {
	id: 'api-monitoring',
	title: 'API モニタリング',
	description:
		'HTTPメソッド/ステータスコードのフィルタ、レスポンスタイムの数値表示、エラー率の可視化限界を検証。',
	hooks: {
		logs: {
			use: 'useState',
			params: { initial: apiLogs },
		},
		totalRequests: {
			use: 'useDerived',
			from: 'logs',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
		avgResponseMs: {
			use: 'useDerived',
			from: 'logs',
			params: { aggregate: { fn: 'avg', key: 'responseMs' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'errorAlert', 'statsGrid', 'tableCard'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'API モニタリング',
				subtitle: 'リアルタイム API リクエストログ',
			},
		},
		errorAlert: {
			type: 'Alert',
			props: {
				type: 'error',
				title: 'エラー検出',
				message: '直近のリクエストで 500/504 エラーが複数発生しています。/api/v1/products と /api/v1/reports/export を確認してください。',
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 4, gap: 4 },
			children: ['statTotal', 'statAvgMs', 'badgeErrors', 'badgeSlow'],
		},
		statTotal: {
			type: 'Stat',
			props: { label: '総リクエスト数', value: '$hook.totalRequests', format: 'number' },
		},
		statAvgMs: {
			type: 'Stat',
			props: { label: '平均応答(ms)', value: '$hook.avgResponseMs', format: 'number' },
		},
		badgeErrors: {
			type: 'Badge',
			props: { text: 'エラー: 6件', color: 'red' },
		},
		badgeSlow: {
			type: 'Badge',
			props: { text: '低速(>1s): 3件', color: 'yellow' },
		},
		tableCard: {
			type: 'Card',
			props: { title: 'リクエストログ' },
			children: ['logTable'],
		},
		logTable: {
			type: 'DataTable',
			props: {
				data: '$hook.logs',
				keyField: 'id',
				emptyMessage: 'ログがありません',
				rowHighlight: [
					{ key: 'statusCode', op: 'gte', value: 500, className: 'bg-red-50' },
					{ key: 'statusCode', op: 'gte', value: 400, className: 'bg-yellow-50' },
				],
				columns: [
					{ key: 'timestamp', label: 'タイムスタンプ', sortable: true },
					{
						key: 'method',
						label: 'メソッド',
						sortable: true,
						format: 'badge',
						badgeMap: { GET: 'blue', POST: 'green', PUT: 'yellow', PATCH: 'yellow', DELETE: 'red' },
						filter: {
							type: 'select',
							options: [
								{ value: 'GET', label: 'GET' },
								{ value: 'POST', label: 'POST' },
								{ value: 'PUT', label: 'PUT' },
								{ value: 'PATCH', label: 'PATCH' },
								{ value: 'DELETE', label: 'DELETE' },
							],
						},
					},
					{ key: 'endpoint', label: 'エンドポイント', sortable: true, filter: { type: 'text', placeholder: 'パス検索...' } },
					{
						key: 'statusCode',
						label: 'ステータス',
						sortable: true,
						valueClassName: { '500': 'font-bold text-red-600', '504': 'font-bold text-red-600', '422': 'text-yellow-600', '401': 'text-yellow-600', '413': 'text-yellow-600', '429': 'text-yellow-600' },
						filter: { type: 'select' },
					},
					{ key: 'responseMs', label: '応答(ms)', sortable: true, format: 'number' },
					{ key: 'bytes', label: 'サイズ(B)', sortable: true, format: 'number' },
				],
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'api', 'monitoring', 'filter-test'],
	},
};

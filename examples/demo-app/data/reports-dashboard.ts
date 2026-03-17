import type { PageSpec } from '@viyv/agent-ui-schema';

export const reportsDashboardSpec: PageSpec = {
	id: 'reports-dashboard',
	title: 'レポートダッシュボード',
	description: 'viyv-db の reports テーブルをリアルタイム表示',
	hooks: {
		reports: {
			use: 'useSqlQuery',
			params: {
				connection: 'viyv-db',
				query: 'SELECT report_id, scenario_label, status, duration_ms, entry_count, error_count FROM reports ORDER BY started_at DESC',
			},
		},
		completedReports: {
			use: 'useSqlQuery',
			params: {
				connection: 'viyv-db',
				query: "SELECT report_id, scenario_label, entry_count, error_count, duration_ms FROM reports WHERE status = 'completed' ORDER BY started_at DESC",
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'infoAlert', 'statsGrid', 'tableCard'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'レポートダッシュボード',
				subtitle: 'viyv-db PostgreSQL データソース',
			},
		},
		infoAlert: {
			type: 'Alert',
			props: {
				variant: 'info',
				title: 'データソース',
				message: 'このページは viyv-db の reports テーブルから useSqlQuery でデータを取得しています。',
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 4 },
			children: ['statTotal', 'statCompleted'],
		},
		statTotal: {
			type: 'Stat',
			props: {
				label: 'レポート総数',
				value: '$hook.reports.rowCount',
			},
		},
		statCompleted: {
			type: 'Stat',
			props: {
				label: '完了レポート',
				value: '$hook.completedReports.rowCount',
			},
		},
		tableCard: {
			type: 'Card',
			props: { title: 'レポート一覧' },
			children: ['reportsTable'],
		},
		reportsTable: {
			type: 'DataTable',
			props: {
				data: '$hook.reports.rows',
				columns: [
					{ key: 'report_id', label: 'レポートID', sortable: true, filter: { type: 'text', placeholder: 'ID検索...' } },
					{ key: 'scenario_label', label: 'シナリオ', sortable: true, filter: { type: 'text', placeholder: 'シナリオ検索...' } },
					{ key: 'status', label: 'ステータス', sortable: true, filter: { type: 'select' } },
					{ key: 'duration_ms', label: '実行時間(ms)', sortable: true },
					{ key: 'entry_count', label: 'エントリ数', sortable: true },
					{ key: 'error_count', label: 'エラー数', sortable: true },
				],
				pageSize: 10,
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'dashboard', 'reports', 'viyv-db'],
	},
};

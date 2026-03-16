import type { PageSpec } from '@viyv/agent-ui-schema';

const users = [
	{ id: 1, name: '山田太郎', email: 'yamada@example.com', role: 'admin', status: 'active', lastLogin: '2026-03-16 09:30', department: '開発部' },
	{ id: 2, name: '鈴木花子', email: 'suzuki@example.com', role: 'editor', status: 'active', lastLogin: '2026-03-16 08:15', department: '営業部' },
	{ id: 3, name: '佐藤次郎', email: 'sato@example.com', role: 'viewer', status: 'inactive', lastLogin: '2026-02-28 14:00', department: '総務部' },
	{ id: 4, name: '田中美咲', email: 'tanaka@example.com', role: 'editor', status: 'active', lastLogin: '2026-03-15 17:45', department: '開発部' },
	{ id: 5, name: '高橋健一', email: 'takahashi@example.com', role: 'admin', status: 'active', lastLogin: '2026-03-16 10:00', department: 'インフラ部' },
	{ id: 6, name: '伊藤真理', email: 'ito@example.com', role: 'viewer', status: 'suspended', lastLogin: '2026-01-15 11:30', department: '営業部' },
	{ id: 7, name: '渡辺洋平', email: 'watanabe@example.com', role: 'editor', status: 'active', lastLogin: '2026-03-14 16:20', department: '開発部' },
	{ id: 8, name: '中村さくら', email: 'nakamura@example.com', role: 'viewer', status: 'active', lastLogin: '2026-03-10 09:00', department: '総務部' },
	{ id: 9, name: '小林大輔', email: 'kobayashi@example.com', role: 'admin', status: 'active', lastLogin: '2026-03-16 07:50', department: 'インフラ部' },
	{ id: 10, name: '加藤玲奈', email: 'kato@example.com', role: 'editor', status: 'inactive', lastLogin: '2026-03-01 13:00', department: '開発部' },
];

/**
 * ユーザー管理ページ
 * 検証: Alert closable (#8), groupBy衝突 (#1), PieChart凡例 (#10),
 *       DataTable minWidth (#7), Badge format
 */
export const userManagementSpec: PageSpec = {
	id: 'user-management',
	title: 'ユーザー管理',
	description:
		'ユーザー一覧と権限管理。closable Alert、groupBy衝突修正、DataTable minWidth、Badge表示を検証。',
	hooks: {
		users: {
			use: 'useState',
			params: { initial: users },
		},
		userCount: {
			use: 'useDerived',
			from: 'users',
			params: { aggregate: { fn: 'count', key: 'id' } },
		},
		// groupBy "role" + aggregate count on "role" => role_count (衝突リネーム)
		byRole: {
			use: 'useDerived',
			from: 'users',
			params: { groupBy: 'role', aggregate: { fn: 'count', key: 'role' } },
		},
		// groupBy "status" + aggregate count on "status" => status_count (衝突リネーム)
		byStatus: {
			use: 'useDerived',
			from: 'users',
			params: { groupBy: 'status', aggregate: { fn: 'count', key: 'status' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'suspendAlert', 'statsGrid', 'chartsGrid', 'tableCard'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'ユーザー管理',
				subtitle: 'チームメンバーのアカウント状況',
			},
		},
		suspendAlert: {
			type: 'Alert',
			props: {
				type: 'warning',
				title: '確認が必要',
				message: '停止中のアカウントが1件、無効化されたアカウントが2件あります。',
				closable: true,
			},
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 3, gap: 16 },
			children: ['statTotal', 'statActive', 'statAdmin'],
		},
		statTotal: {
			type: 'Stat',
			props: { label: '総ユーザー数', value: '$hook.userCount', format: 'number' },
		},
		statActive: {
			type: 'Stat',
			props: {
				label: 'アクティブ',
				value: 7,
				trend: { direction: 'up', value: '+2', color: 'green' },
			},
		},
		statAdmin: {
			type: 'Stat',
			props: { label: '管理者数', value: 3 },
		},
		chartsGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['roleCard', 'statusCard'],
		},
		roleCard: {
			type: 'Card',
			props: { title: '権限別ユーザー数' },
			children: ['roleChart'],
		},
		roleChart: {
			type: 'PieChart',
			props: {
				data: '$hook.byRole',
				nameKey: 'role',
				valueKey: 'role_count',
				title: '権限分布',
			},
		},
		statusCard: {
			type: 'Card',
			props: { title: 'ステータス別ユーザー数' },
			children: ['statusChart'],
		},
		statusChart: {
			type: 'BarChart',
			props: {
				data: '$hook.byStatus',
				xKey: 'status',
				yKey: 'status_count',
				title: 'ステータス分布',
			},
		},
		tableCard: {
			type: 'Card',
			props: { title: 'ユーザー一覧' },
			children: ['userTable'],
		},
		userTable: {
			type: 'DataTable',
			props: {
				data: '$hook.users',
				keyField: 'id',
				columns: [
					{ key: 'name', label: '名前', sortable: true, filter: { type: 'text', placeholder: '名前検索...' } },
					{ key: 'email', label: 'メール', sortable: true, truncate: true },
					{
						key: 'role',
						label: '権限',
						sortable: true,
						format: 'badge',
						badgeMap: { admin: 'red', editor: 'blue', viewer: 'gray' },
						filter: { type: 'select' },
					},
					{
						key: 'status',
						label: 'ステータス',
						sortable: true,
						format: 'badge',
						badgeMap: { active: 'green', inactive: 'gray', suspended: 'red' },
						filter: { type: 'select' },
					},
					{ key: 'department', label: '部署', sortable: true, filter: { type: 'select' } },
					{ key: 'lastLogin', label: '最終ログイン', sortable: true, minWidth: 140 },
				],
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'user-management', 'closable-alert', 'groupBy-collision', 'minWidth'],
	},
};

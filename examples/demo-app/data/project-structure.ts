import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * プロジェクト構成図 デモページ
 * 検証: TreeList (role="tree" + expand/collapse), Tabs, BarChart
 */
export const projectStructureSpec: PageSpec = {
	id: 'project-structure',
	title: 'プロジェクト構成図',
	description: 'TreeList を使ったプロジェクト階層表示のデモ',
	hooks: {
		projectTree: {
			use: 'useState',
			params: {
				initial: [
					{
						id: 'platform',
						label: 'Viyv プラットフォーム v2.0',
						children: [
							{
								id: 'frontend',
								label: 'フロントエンド',
								children: [
									{ id: 'fe-dashboard', label: 'ダッシュボード UI', children: [] },
									{ id: 'fe-components', label: 'コンポーネントライブラリ', children: [] },
									{ id: 'fe-auth', label: '認証モジュール', children: [] },
								],
							},
							{
								id: 'backend',
								label: 'バックエンド',
								children: [
									{ id: 'be-api', label: 'REST API', children: [] },
									{ id: 'be-graphql', label: 'GraphQL ゲートウェイ', children: [] },
									{ id: 'be-worker', label: 'バックグラウンドワーカー', children: [] },
									{ id: 'be-auth', label: '認証サービス', children: [] },
								],
							},
							{
								id: 'infra',
								label: 'インフラストラクチャ',
								children: [
									{ id: 'infra-k8s', label: 'Kubernetes 設定', children: [] },
									{ id: 'infra-ci', label: 'CI/CD パイプライン', children: [] },
									{ id: 'infra-monitoring', label: '監視・アラート', children: [] },
								],
							},
							{
								id: 'data',
								label: 'データ基盤',
								children: [
									{ id: 'data-pipeline', label: 'ETL パイプライン', children: [] },
									{ id: 'data-warehouse', label: 'データウェアハウス', children: [] },
									{ id: 'data-ml', label: 'ML モデル管理', children: [] },
								],
							},
						],
					},
				],
			},
		},
		teamTree: {
			use: 'useState',
			params: {
				initial: [
					{
						id: 'team-fe',
						label: 'フロントエンドチーム (4名)',
						children: [
							{ id: 'member-1', label: '田中太郎 — リード', children: [] },
							{ id: 'member-2', label: '鈴木花子 — シニア', children: [] },
							{ id: 'member-3', label: '佐藤健一 — ミドル', children: [] },
							{ id: 'member-4', label: '山田美咲 — ジュニア', children: [] },
						],
					},
					{
						id: 'team-be',
						label: 'バックエンドチーム (3名)',
						children: [
							{ id: 'member-5', label: '高橋翔太 — リード', children: [] },
							{ id: 'member-6', label: '伊藤理恵 — シニア', children: [] },
							{ id: 'member-7', label: '渡辺大輝 — ミドル', children: [] },
						],
					},
					{
						id: 'team-infra',
						label: 'インフラチーム (2名)',
						children: [
							{ id: 'member-8', label: '中村さくら — リード', children: [] },
							{ id: 'member-9', label: '小林拓也 — シニア', children: [] },
						],
					},
				],
			},
		},
		modules: {
			use: 'useState',
			params: {
				initial: [
					{ module: 'フロントエンド', completed: 2, inProgress: 1 },
					{ module: 'バックエンド', completed: 3, inProgress: 1 },
					{ module: 'インフラ', completed: 1, inProgress: 2 },
					{ module: 'データ基盤', completed: 1, inProgress: 2 },
				],
			},
		},
		totalModules: {
			use: 'useDerived',
			from: 'modules',
			params: { aggregate: { fn: 'count', key: 'module' } },
		},
		totalCompleted: {
			use: 'useDerived',
			from: 'modules',
			params: { aggregate: { fn: 'sum', key: 'completed' } },
		},
		totalInProgress: {
			use: 'useDerived',
			from: 'modules',
			params: { aggregate: { fn: 'sum', key: 'inProgress' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'statsGrid', 'tabs', 'moduleChart', 'navLinks'],
		},
		header: {
			type: 'Header',
			props: { title: 'プロジェクト構成図', subtitle: 'Viyv プラットフォーム v2.0' },
		},
		statsGrid: {
			type: 'Grid',
			props: { columns: 4, gap: 16 },
			children: ['statModules', 'statComponents', 'statCompleted', 'statInProgress'],
		},
		statModules: {
			type: 'Stat',
			props: { label: 'モジュール数', value: '$hook.totalModules', format: 'number' },
		},
		statComponents: {
			type: 'Stat',
			props: { label: '全コンポーネント', value: 13, format: 'number' },
		},
		statCompleted: {
			type: 'Stat',
			props: { label: '完了', value: '$hook.totalCompleted', format: 'number' },
		},
		statInProgress: {
			type: 'Stat',
			props: { label: '進行中', value: '$hook.totalInProgress', format: 'number' },
		},
		tabs: {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'structure', label: '構成' },
					{ id: 'team', label: 'チーム編成' },
				],
			},
			children: ['structureCard', 'teamCard'],
		},
		structureCard: {
			type: 'Card',
			props: { title: 'プロジェクト構成' },
			children: ['projectTree'],
		},
		projectTree: {
			type: 'TreeList',
			props: { data: '$hook.projectTree', defaultExpanded: true },
		},
		teamCard: {
			type: 'Card',
			props: { title: 'チーム編成' },
			children: ['teamTree'],
		},
		teamTree: {
			type: 'TreeList',
			props: { data: '$hook.teamTree', defaultExpanded: true },
		},
		moduleChart: {
			type: 'Card',
			props: { title: 'モジュール別完了数' },
			children: ['barChart'],
		},
		barChart: {
			type: 'BarChart',
			props: {
				data: '$hook.modules',
				xKey: 'module',
				yKey: 'completed',
				title: 'モジュール別完了タスク',
			},
		},
		navLinks: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['linkGantt', 'linkKanban'],
		},
		linkGantt: {
			type: 'Link',
			props: { href: '/pages/gantt-schedule', label: 'ガントチャートを見る' },
		},
		linkKanban: {
			type: 'Link',
			props: { href: '/pages/kanban-board', label: 'カンバンボードを見る' },
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'project', 'tree-list', 'structure'],
	},
};

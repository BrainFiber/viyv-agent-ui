import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * ガントチャート デモページ
 * 検証: GanttChart, ProgressBar (複数サイズ), Stat
 */
export const ganttScheduleSpec: PageSpec = {
	id: 'gantt-schedule',
	title: 'ガントチャート',
	description: 'GanttChart + ProgressBar を使ったスケジュール管理デモ',
	hooks: {
		ganttTasks: {
			use: 'useState',
			params: {
				initial: [
					{ task: '要件定義', start: '2026-03-01', end: '2026-03-05', progress: 100, phase: '計画' },
					{ task: 'ユーザーストーリー作成', start: '2026-03-03', end: '2026-03-06', progress: 100, phase: '計画' },
					{ task: 'アーキテクチャ設計', start: '2026-03-05', end: '2026-03-09', progress: 80, phase: '設計' },
					{ task: 'DB スキーマ設計', start: '2026-03-06', end: '2026-03-10', progress: 70, phase: '設計' },
					{ task: 'API 設計', start: '2026-03-08', end: '2026-03-12', progress: 60, phase: '設計' },
					{ task: '認証モジュール実装', start: '2026-03-10', end: '2026-03-16', progress: 50, phase: '開発' },
					{ task: 'CRUD API 実装', start: '2026-03-11', end: '2026-03-18', progress: 45, phase: '開発' },
					{ task: 'UI コンポーネント実装', start: '2026-03-12', end: '2026-03-20', progress: 35, phase: '開発' },
					{ task: 'ダッシュボード画面', start: '2026-03-14', end: '2026-03-22', progress: 25, phase: '開発' },
					{ task: 'データ連携', start: '2026-03-16', end: '2026-03-24', progress: 20, phase: '開発' },
					{ task: '単体テスト', start: '2026-03-18', end: '2026-03-25', progress: 15, phase: 'テスト' },
					{ task: '結合テスト', start: '2026-03-20', end: '2026-03-27', progress: 10, phase: 'テスト' },
					{ task: 'E2E テスト', start: '2026-03-22', end: '2026-03-28', progress: 5, phase: 'テスト' },
					{ task: 'ステージング展開', start: '2026-03-26', end: '2026-03-29', progress: 5, phase: 'リリース' },
					{ task: '本番リリース', start: '2026-03-29', end: '2026-03-31', progress: 0, phase: 'リリース' },
				],
			},
		},
		taskCount: {
			use: 'useDerived',
			from: 'ganttTasks',
			params: { aggregate: { fn: 'count', key: 'task' } },
		},
		avgProgress: {
			use: 'useDerived',
			from: 'ganttTasks',
			params: { aggregate: { fn: 'avg', key: 'progress' } },
		},
		completedCount: {
			use: 'useDerived',
			from: 'ganttTasks',
			params: { filter: { key: 'progress', match: 100 }, aggregate: { fn: 'count', key: 'task' } },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'progressCard', 'ganttCard', 'phaseCard', 'navLinks'],
		},
		header: {
			type: 'Header',
			props: { title: 'ガントチャート', subtitle: 'Sprint 3 — 2026年3月' },
		},
		progressCard: {
			type: 'Card',
			props: { title: 'スプリント全体進捗' },
			children: ['overallProgress', 'progressStats'],
		},
		overallProgress: {
			type: 'ProgressBar',
			props: { value: '$hook.avgProgress', size: 'lg', showValue: true, color: 'blue', label: 'スプリント全体進捗' },
		},
		progressStats: {
			type: 'Grid',
			props: { columns: 3, gap: 16 },
			children: ['statTaskCount', 'statCompleted', 'statAvgProgress'],
		},
		statTaskCount: {
			type: 'Stat',
			props: { label: 'タスク数', value: '$hook.taskCount', format: 'number' },
		},
		statCompleted: {
			type: 'Stat',
			props: { label: '完了', value: '$hook.completedCount', format: 'number' },
		},
		statAvgProgress: {
			type: 'Stat',
			props: { label: '平均進捗率', value: '$hook.avgProgress', format: 'number' },
		},
		ganttCard: {
			type: 'Card',
			props: { title: 'スケジュール' },
			children: ['gantt'],
		},
		gantt: {
			type: 'GanttChart',
			props: {
				data: '$hook.ganttTasks',
				taskKey: 'task',
				startKey: 'start',
				endKey: 'end',
				progressKey: 'progress',
				groupKey: 'phase',
				title: 'タスクスケジュール',
			},
		},
		phaseCard: {
			type: 'Card',
			props: { title: 'フェーズ別進捗' },
			children: ['phaseStack'],
		},
		phaseStack: {
			type: 'Stack',
			props: { gap: 12 },
			children: ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'],
		},
		phase1: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['phase1Label', 'phase1Bar'],
		},
		phase1Label: {
			type: 'Text',
			props: { content: '計画', weight: 'medium', size: 'sm' },
		},
		phase1Bar: {
			type: 'ProgressBar',
			props: { value: 100, color: 'green', showValue: true, label: '計画フェーズ進捗' },
		},
		phase2: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['phase2Label', 'phase2Bar'],
		},
		phase2Label: {
			type: 'Text',
			props: { content: '設計', weight: 'medium', size: 'sm' },
		},
		phase2Bar: {
			type: 'ProgressBar',
			props: { value: 70, color: 'blue', showValue: true, label: '設計フェーズ進捗' },
		},
		phase3: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['phase3Label', 'phase3Bar'],
		},
		phase3Label: {
			type: 'Text',
			props: { content: '開発', weight: 'medium', size: 'sm' },
		},
		phase3Bar: {
			type: 'ProgressBar',
			props: { value: 35, color: 'yellow', showValue: true, label: '開発フェーズ進捗' },
		},
		phase4: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['phase4Label', 'phase4Bar'],
		},
		phase4Label: {
			type: 'Text',
			props: { content: 'テスト', weight: 'medium', size: 'sm' },
		},
		phase4Bar: {
			type: 'ProgressBar',
			props: { value: 10, color: 'yellow', showValue: true, label: 'テストフェーズ進捗' },
		},
		phase5: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['phase5Label', 'phase5Bar'],
		},
		phase5Label: {
			type: 'Text',
			props: { content: 'リリース', weight: 'medium', size: 'sm' },
		},
		phase5Bar: {
			type: 'ProgressBar',
			props: { value: 5, color: 'red', showValue: true, label: 'リリースフェーズ進捗' },
		},
		navLinks: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['linkStructure', 'linkKanban'],
		},
		linkStructure: {
			type: 'Link',
			props: { href: '/pages/project-structure', label: 'プロジェクト構成図へ' },
		},
		linkKanban: {
			type: 'Link',
			props: { href: '/pages/kanban-board', label: 'カンバンボードへ' },
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'gantt-chart', 'progress-bar', 'schedule'],
	},
};

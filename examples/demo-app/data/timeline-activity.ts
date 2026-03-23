import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * タイムライン＆アクティビティ デモ
 * 検証: Timeline, Feed, TreeList, Tabs, ScrollArea, Avatar, Badge, Link, Item
 */
export const timelineActivitySpec: PageSpec = {
	id: 'timeline-activity',
	title: 'タイムライン＆アクティビティ',
	description: 'Timeline, Feed, TreeList を使ったアクティビティ表示',
	hooks: {
		milestones: {
			use: 'useState',
			params: {
				initial: [
					{ id: 'ms-1', title: 'プロジェクト開始', date: '2026-01-15', status: '完了', author: '田中太郎' },
					{ id: 'ms-2', title: '要件定義完了', date: '2026-02-01', status: '完了', author: '高橋翔太' },
					{ id: 'ms-3', title: 'デザインレビュー', date: '2026-02-15', status: '完了', author: '鈴木花子' },
					{ id: 'ms-4', title: 'MVP リリース', date: '2026-03-01', status: '完了', author: '佐藤健一' },
					{ id: 'ms-5', title: 'ベータテスト開始', date: '2026-03-10', status: '進行中', author: '中村さくら' },
					{ id: 'ms-6', title: 'パフォーマンスチューニング', date: '2026-03-20', status: '進行中', author: '渡辺大輝' },
					{ id: 'ms-7', title: 'セキュリティ監査', date: '2026-04-01', status: '予定', author: '小林拓也' },
					{ id: 'ms-8', title: '正式リリース', date: '2026-04-15', status: '予定', author: '田中太郎' },
				],
			},
		},
		posts: {
			use: 'useState',
			params: {
				initial: [
					{
						id: 'post-1',
						author: '田中太郎',
						handle: '@tanaka',
						content: 'Sprint 4 のキックオフミーティング完了。今回は認証周りのリファクタリングと検索機能の強化がメインです。',
						timestamp: '10分前',
						likes: 12,
						replies: 3,
						avatarUrl: 'https://picsum.photos/seed/act1/80/80',
						media: null,
					},
					{
						id: 'post-2',
						author: '鈴木花子',
						handle: '@suzuki',
						content: 'ダッシュボードの新デザイン案を Figma に上げました。フィードバックお願いします！',
						timestamp: '30分前',
						likes: 24,
						replies: 8,
						avatarUrl: 'https://picsum.photos/seed/act2/80/80',
						media: 'https://picsum.photos/seed/design/600/300',
					},
					{
						id: 'post-3',
						author: '高橋翔太',
						handle: '@takahashi',
						content: 'RBAC 権限設定の PR を出しました。コードレビューお願いします。テストカバレッジ 95% です。',
						timestamp: '1時間前',
						likes: 18,
						replies: 5,
						avatarUrl: 'https://picsum.photos/seed/act3/80/80',
						media: null,
					},
					{
						id: 'post-4',
						author: '山田美咲',
						handle: '@yamada',
						content: '検索フィルタ実装の進捗報告。全文検索 + ファセットフィルタの基盤が完成しました。来週中に UI を仕上げます。',
						timestamp: '2時間前',
						likes: 31,
						replies: 7,
						avatarUrl: 'https://picsum.photos/seed/act4/80/80',
						media: null,
					},
					{
						id: 'post-5',
						author: '渡辺大輝',
						handle: '@watanabe',
						content: 'DB インデックス最適化の結果報告。主要クエリのレスポンスタイムが平均 65% 改善されました。',
						timestamp: '3時間前',
						likes: 45,
						replies: 12,
						avatarUrl: null,
						media: null,
					},
					{
						id: 'post-6',
						author: '伊藤理恵',
						handle: '@ito',
						content: 'Slack 連携の実装が完了しました。チャンネル通知、DM 通知、カスタム Webhook に対応しています。',
						timestamp: '4時間前',
						likes: 28,
						replies: 6,
						avatarUrl: 'https://picsum.photos/seed/act6/80/80',
						media: null,
					},
					{
						id: 'post-7',
						author: '中村さくら',
						handle: '@nakamura',
						content: 'E2E テストを 20 件追加しました。認証フロー、検索、CRUD 操作をカバーしています。CI も緑です。',
						timestamp: '5時間前',
						likes: 15,
						replies: 2,
						avatarUrl: 'https://picsum.photos/seed/act7/80/80',
						media: null,
					},
					{
						id: 'post-8',
						author: '小林拓也',
						handle: '@kobayashi',
						content: 'CI パイプラインの改善が完了。ビルド時間が 12分 → 4分に短縮されました。キャッシュ戦略の見直しが効きました。',
						timestamp: '6時間前',
						likes: 52,
						replies: 14,
						avatarUrl: null,
						media: null,
					},
				],
			},
		},
		fileTree: {
			use: 'useState',
			params: {
				initial: [
					{
						id: 'src',
						label: 'src/',
						children: [
							{
								id: 'components',
								label: 'components/',
								children: [
									{ id: 'button-tsx', label: 'Button.tsx', children: [] },
									{ id: 'dialog-tsx', label: 'Dialog.tsx', children: [] },
									{ id: 'card-tsx', label: 'Card.tsx', children: [] },
									{ id: 'header-tsx', label: 'Header.tsx', children: [] },
									{ id: 'text-tsx', label: 'Text.tsx', children: [] },
								],
							},
							{
								id: 'lib',
								label: 'lib/',
								children: [
									{ id: 'utils-ts', label: 'utils.ts', children: [] },
									{ id: 'icons-ts', label: 'icons.ts', children: [] },
								],
							},
							{
								id: 'pages',
								label: 'pages/',
								children: [
									{ id: 'index-tsx', label: 'index.tsx', children: [] },
									{ id: 'dashboard-tsx', label: 'dashboard.tsx', children: [] },
									{ id: 'settings-tsx', label: 'settings.tsx', children: [] },
								],
							},
						],
					},
					{
						id: 'package-json',
						label: 'package.json',
						children: [],
					},
					{
						id: 'readme-md',
						label: 'README.md',
						children: [],
					},
					{
						id: 'tsconfig-json',
						label: 'tsconfig.json',
						children: [],
					},
				],
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'tabs'],
		},

		/* ── ページヘッダー ── */
		header: {
			type: 'Header',
			props: { title: 'アクティビティセンター', subtitle: 'プロジェクトの進捗とチームの活動を確認' },
		},

		/* ── タブ ── */
		tabs: {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'timeline', label: 'タイムライン' },
					{ id: 'feed', label: 'フィード' },
					{ id: 'filetree', label: 'ファイルツリー' },
				],
			},
			children: ['timelineTab', 'feedTab', 'fileTreeTab'],
		},

		/* ==============================
		 * タイムライン タブ
		 * ============================== */
		timelineTab: {
			type: 'Stack',
			props: { gap: 16 },
			children: ['timeline'],
		},
		timeline: {
			type: 'Timeline',
			props: {
				data: '$hook.milestones',
				keyField: 'id',
				labelKey: 'title',
				timestampKey: 'date',
			},
			children: ['timelineItemCard'],
		},
		timelineItemCard: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['timelineItemTitle', 'timelineItemMeta'],
		},
		timelineItemTitle: {
			type: 'Text',
			props: { content: '$item.title', weight: 'semibold', size: 'sm' },
		},
		timelineItemMeta: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center' },
			children: ['timelineItemBadge', 'timelineItemDate', 'timelineItemAvatar', 'timelineItemAuthor'],
		},
		timelineItemBadge: {
			type: 'Badge',
			props: {
				text: '$item.status',
				color: '$expr(item.status === "完了" ? "green" : item.status === "進行中" ? "blue" : "gray")',
			},
		},
		timelineItemDate: {
			type: 'Text',
			props: { content: '$item.date', size: 'xs', color: 'muted' },
		},
		timelineItemAvatar: {
			type: 'Avatar',
			props: { name: '$item.author', size: 'sm' },
		},
		timelineItemAuthor: {
			type: 'Text',
			props: { content: '$item.author', size: 'xs', color: 'muted' },
		},

		/* ==============================
		 * フィード タブ
		 * ============================== */
		feedTab: {
			type: 'ScrollArea',
			props: { maxHeight: 500 },
			children: ['feed'],
		},
		feed: {
			type: 'Feed',
			props: {
				data: '$hook.posts',
				keyField: 'id',
				labelKey: 'author',
				pageSize: 10,
			},
			children: ['feedItem'],
		},
		feedItem: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 12, align: 'start', className: 'p-4' },
			children: ['feedAvatar', 'feedBody'],
		},
		feedAvatar: {
			type: 'Avatar',
			props: { src: '$item.avatarUrl', name: '$item.author' },
		},
		feedBody: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 4, className: 'flex-1 min-w-0' },
			children: ['feedMeta', 'feedContent', 'feedMedia', 'feedActions'],
		},
		feedMeta: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center' },
			children: ['feedAuthorName', 'feedHandle', 'feedTimestamp'],
		},
		feedAuthorName: {
			type: 'Text',
			props: { content: '$item.author', weight: 'bold', size: 'sm' },
		},
		feedHandle: {
			type: 'Text',
			props: { content: '$item.handle', color: 'muted', size: 'sm' },
		},
		feedTimestamp: {
			type: 'Text',
			props: { content: '$item.timestamp', color: 'muted', size: 'sm' },
		},
		feedContent: {
			type: 'Text',
			props: { content: '$item.content', variant: 'body' },
		},
		feedMedia: {
			type: 'Image',
			props: { src: '$item.media', objectFit: 'cover', className: 'rounded-lg' },
			visible: { expr: 'item?.media != null' },
		},
		feedActions: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 24 },
			children: ['feedReplies', 'feedLikes'],
		},
		feedReplies: {
			type: 'Text',
			props: { content: '$expr(`💬 ${item.replies}`)', color: 'muted', size: 'sm' },
		},
		feedLikes: {
			type: 'Text',
			props: { content: '$expr(`❤️ ${item.likes}`)', color: 'muted', size: 'sm' },
		},

		/* ==============================
		 * ファイルツリー タブ
		 * ============================== */
		fileTreeTab: {
			type: 'Card',
			props: { title: 'プロジェクトファイル構成' },
			children: ['fileTree'],
		},
		fileTree: {
			type: 'TreeList',
			props: { data: '$hook.fileTree', defaultExpanded: true },
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'timeline', 'feed', 'activity', 'tree-list', 'scroll-area'],
	},
};

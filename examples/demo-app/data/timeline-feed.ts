import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * X風タイムライン デモページ
 * 検証: Feed (role="feed" + article), Avatar, $expr(), Tabs, Pagination
 */
export const timelineFeedSpec: PageSpec = {
	id: 'timeline-feed',
	title: 'タイムラインデモ',
	description: 'Feed + Avatar を使ったX風タイムラインのデモページ',
	hooks: {
		posts: {
			use: 'useState',
			params: {
				initial: [
					{
						id: 1,
						author: '田中太郎',
						handle: '@tanaka_taro',
						time: '2分前',
						avatarUrl: 'https://picsum.photos/seed/user1/80/80',
						content:
							'今日のリリース無事完了しました！チーム全員の協力のおかげです。来週からは新機能の開発に取り掛かります 🚀',
						media: null,
						replies: 12,
						reposts: 5,
						likes: 48,
						views: 1200,
					},
					{
						id: 2,
						author: '鈴木花子',
						handle: '@suzuki_hanako',
						time: '15分前',
						avatarUrl: 'https://picsum.photos/seed/user2/80/80',
						content:
							'React Server Components の勉強会を社内で開催しました。参加者からの質問も活発で充実した時間でした。資料は後日共有します。',
						media: 'https://picsum.photos/seed/post2/600/300',
						replies: 8,
						reposts: 23,
						likes: 95,
						views: 3400,
					},
					{
						id: 3,
						author: '佐藤健一',
						handle: '@sato_kenichi',
						time: '1時間前',
						avatarUrl: null,
						content:
							'モノレポ構成を Turborepo に移行しました。ビルド時間が 60% 短縮されて開発体験が大幅改善。キャッシュヒット率も高くて最高です。',
						media: null,
						replies: 31,
						reposts: 67,
						likes: 210,
						views: 8900,
					},
					{
						id: 4,
						author: '山田美咲',
						handle: '@yamada_misaki',
						time: '2時間前',
						avatarUrl: 'https://picsum.photos/seed/user4/80/80',
						content:
							'新しいデザインシステムのプロトタイプが完成しました。Figma と Storybook の連携もバッチリ。来週のデザインレビューが楽しみです。',
						media: 'https://picsum.photos/seed/post4/600/300',
						replies: 15,
						reposts: 12,
						likes: 76,
						views: 2100,
					},
					{
						id: 5,
						author: '高橋翔太',
						handle: '@takahashi_shota',
						time: '3時間前',
						avatarUrl: 'https://picsum.photos/seed/user5/80/80',
						content:
							'TypeScript 5.5 の新機能を試してみた。inferred type predicates が便利すぎる。コードが格段にスッキリします。',
						media: null,
						replies: 22,
						reposts: 45,
						likes: 158,
						views: 5600,
					},
					{
						id: 6,
						author: '伊藤理恵',
						handle: '@ito_rie',
						time: '4時間前',
						avatarUrl: null,
						content:
							'パフォーマンスチューニングの結果、API レスポンスタイムを 200ms → 45ms に改善できました。ボトルネックは N+1 クエリでした。',
						media: null,
						replies: 42,
						reposts: 89,
						likes: 320,
						views: 12000,
					},
					{
						id: 7,
						author: '渡辺大輝',
						handle: '@watanabe_daiki',
						time: '5時間前',
						avatarUrl: 'https://picsum.photos/seed/user7/80/80',
						content:
							'E2E テストを Playwright に移行完了。並列実行のおかげでテスト時間が半分になりました。CI のフィードバックが早くなって嬉しい。',
						media: null,
						replies: 9,
						reposts: 18,
						likes: 64,
						views: 1800,
					},
					{
						id: 8,
						author: '中村さくら',
						handle: '@nakamura_sakura',
						time: '6時間前',
						avatarUrl: 'https://picsum.photos/seed/user8/80/80',
						content:
							'アクセシビリティ監査の結果が届きました。WCAG 2.1 AA 準拠率が 92% → 98% に向上。残りの項目も来月中に対応予定です。',
						media: null,
						replies: 18,
						reposts: 34,
						likes: 142,
						views: 4200,
					},
					{
						id: 9,
						author: '小林拓也',
						handle: '@kobayashi_takuya',
						time: '8時間前',
						avatarUrl: null,
						content:
							'GraphQL から tRPC に移行する PoC を進めています。型安全性が段違いで、フロントとバックエンドの開発効率が上がりそう。',
						media: 'https://picsum.photos/seed/post9/600/300',
						replies: 27,
						reposts: 41,
						likes: 185,
						views: 7300,
					},
					{
						id: 10,
						author: '松本優子',
						handle: '@matsumoto_yuko',
						time: '10時間前',
						avatarUrl: 'https://picsum.photos/seed/user10/80/80',
						content:
							'コードレビューのガイドラインを社内 Wiki にまとめました。レビュー品質の均一化と、新メンバーのオンボーディング短縮が目的です。',
						media: null,
						replies: 14,
						reposts: 28,
						likes: 97,
						views: 3100,
					},
				],
			},
		},
	},
	root: 'page',
	elements: {
		page: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 0 },
			children: ['header', 'tabs'],
		},
		header: {
			type: 'Header',
			props: { title: 'タイムライン', level: 1 },
		},
		tabs: {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'recommend', label: 'おすすめ' },
					{ id: 'following', label: 'フォロー中' },
				],
			},
			children: ['feed', 'emptyTab'],
		},
		feed: {
			type: 'Feed',
			props: {
				data: '$hook.posts',
				keyField: 'id',
				labelKey: 'author',
				pageSize: 5,
			},
			children: ['postRow'],
		},
		postRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 12, align: 'start', className: 'p-4' },
			children: ['avatar', 'postBody'],
		},
		avatar: {
			type: 'Avatar',
			props: { src: '$item.avatarUrl', name: '$item.author' },
		},
		postBody: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 4, className: 'flex-1 min-w-0' },
			children: ['postMeta', 'content', 'media', 'actionBar'],
		},
		postMeta: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center' },
			children: ['authorName', 'handle', 'time'],
		},
		authorName: {
			type: 'Text',
			props: { content: '$item.author', weight: 'bold', size: 'sm' },
		},
		handle: {
			type: 'Text',
			props: { content: '$item.handle', color: 'muted', size: 'sm' },
		},
		time: {
			type: 'Text',
			props: { content: '$item.time', color: 'muted', size: 'sm' },
		},
		content: {
			type: 'Text',
			props: { content: '$item.content', variant: 'body' },
		},
		media: {
			type: 'Image',
			props: { src: '$item.media', objectFit: 'cover', className: 'rounded-lg' },
			visible: { expr: 'item?.media != null' },
		},
		actionBar: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 24 },
			children: ['replyText', 'repostText', 'likeText', 'viewText'],
		},
		replyText: {
			type: 'Text',
			props: { content: '$expr(`💬 ${item.replies}`)', color: 'muted', size: 'sm' },
		},
		repostText: {
			type: 'Text',
			props: { content: '$expr(`🔁 ${item.reposts}`)', color: 'muted', size: 'sm' },
		},
		likeText: {
			type: 'Text',
			props: { content: '$expr(`❤️ ${item.likes}`)', color: 'muted', size: 'sm' },
		},
		viewText: {
			type: 'Text',
			props: { content: '$expr(`👁 ${item.views}`)', color: 'muted', size: 'sm' },
		},
		emptyTab: {
			type: 'Text',
			props: { content: 'フォロー中のタイムラインは準備中です', color: 'muted' },
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'timeline', 'feed', 'avatar', 'tabs'],
	},
};

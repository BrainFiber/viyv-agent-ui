import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * ブログ記事ページ デモ
 * 検証: Container, Stack, Card, Header, Text, Badge, Link, Avatar, Divider,
 *       Image, Carousel, Calendar, Spacer, Breadcrumbs, HoverCard, Toggle,
 *       ToggleGroup, AspectRatio, Collapsible, Resizable
 */
export const contentBlogSpec: PageSpec = {
	id: 'content-blog',
	title: 'ブログ記事ページ',
	description: 'タイポグラフィ、メディア、インタラクティブ要素を含むリッチコンテンツ',
	hooks: {},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['breadcrumbs', 'container'],
		},

		/* ── パンくずリスト ── */
		breadcrumbs: {
			type: 'Breadcrumbs',
			props: {
				items: [
					{ label: 'ブログ', href: '/pages/content-blog' },
					{ label: 'テクノロジー', href: '/pages/content-blog' },
					{ label: 'AI時代のUIフレームワーク設計' },
				],
			},
		},

		/* ── メインコンテナ ── */
		container: {
			type: 'Container',
			props: { maxWidth: 800 },
			children: [
				'articleHeader',
				'authorRow',
				'divider1',
				'heroAspect',
				'spacer1',
				'introHeading',
				'introBody',
				'principleHeading',
				'principleBody',
				'codeCollapsible',
				'divider2',
				'relatedCarousel',
				'divider3',
				'reactionGroup',
				'followToggle',
				'divider4',
				'resizableSection',
				'calendar',
			],
		},

		/* ── 記事ヘッダー ── */
		articleHeader: {
			type: 'Header',
			props: {
				title: 'AI時代のUIフレームワーク設計',
				level: 1,
			},
		},

		/* ── 著者情報 ── */
		authorRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 12, align: 'center' },
			children: ['authorAvatar', 'authorHoverCard', 'publishDate', 'categoryBadge'],
		},
		authorAvatar: {
			type: 'Avatar',
			props: { name: '田中太郎', size: 'sm' },
		},
		authorHoverCard: {
			type: 'HoverCard',
			props: { content: 'フロントエンドエンジニア。React / Next.js を中心に、UIフレームワーク設計やアクセシビリティに関する記事を執筆。著書「コンポーネント駆動開発入門」。' },
			children: ['authorName'],
		},
		authorName: {
			type: 'Text',
			props: { content: '田中太郎', weight: 'semibold', size: 'sm' },
		},
		publishDate: {
			type: 'Text',
			props: { content: '2024-03-15', color: 'muted', size: 'sm' },
		},
		categoryBadge: {
			type: 'Badge',
			props: { text: 'テクノロジー', color: 'blue' },
		},

		/* ── 区切り線 ── */
		divider1: {
			type: 'Divider',
			props: {},
		},

		/* ── ヒーロー画像 ── */
		heroAspect: {
			type: 'AspectRatio',
			props: { ratio: 16 / 9 },
			children: ['heroImage'],
		},
		heroImage: {
			type: 'Image',
			props: {
				src: 'https://placehold.co/1200x675',
				alt: '記事ヒーロー画像 — AI時代のUIフレームワーク設計',
				width: 1200,
				height: 675,
			},
		},

		/* ── スペーサー ── */
		spacer1: {
			type: 'Spacer',
			props: { size: 16 },
		},

		/* ── はじめに ── */
		introHeading: {
			type: 'Text',
			props: { content: 'はじめに', variant: 'heading', weight: 'bold' },
		},
		introBody: {
			type: 'Text',
			props: {
				content:
					'AI が直接 UI を操作する時代において、フレームワーク設計に求められるものは大きく変化しています。従来のユーザー中心設計に加え、AI エージェントがアクセシビリティツリーや構造化データを通じてインターフェースを理解し操作できることが不可欠です。本記事では、そのための設計原則と実践的なアプローチを解説します。',
				variant: 'body',
			},
		},

		/* ── コンポーネント設計の原則 ── */
		principleHeading: {
			type: 'Text',
			props: { content: 'コンポーネント設計の原則', variant: 'heading', weight: 'bold' },
		},
		principleBody: {
			type: 'Text',
			props: {
				content:
					'コンポーネントは宣言的に定義され、AI が PageSpec として操作可能であるべきです。各要素はユニークに識別可能であり、ARIA ロールとラベルが正しく付与されている必要があります。これにより、AI エージェントは read_page でページ構造を把握し、find で要素を特定して操作を実行できます。',
				variant: 'body',
			},
		},

		/* ── コード例（折り畳み） ── */
		codeCollapsible: {
			type: 'Collapsible',
			props: { title: 'コード例を表示' },
			children: ['codeExample'],
		},
		codeExample: {
			type: 'Text',
			props: {
				content:
					'const spec: PageSpec = {\n  id: "example",\n  root: "root",\n  elements: {\n    root: { type: "Stack", props: { gap: 8 }, children: ["header"] },\n    header: { type: "Header", props: { title: "Hello AI" } },\n  },\n};',
				variant: 'body',
				className: 'font-mono text-xs bg-muted p-4 rounded-lg whitespace-pre-wrap',
			},
		},

		/* ── 区切り線 ── */
		divider2: {
			type: 'Divider',
			props: {},
		},

		/* ── 関連画像カルーセル ── */
		relatedCarousel: {
			type: 'Carousel',
			props: { showDots: true, showArrows: true },
			children: ['carouselImg1', 'carouselImg2', 'carouselImg3'],
		},
		carouselImg1: {
			type: 'Image',
			props: {
				src: 'https://picsum.photos/seed/blog1/600/300',
				alt: '関連画像 1 — コンポーネントアーキテクチャ',
				width: 600,
				height: 300,
			},
		},
		carouselImg2: {
			type: 'Image',
			props: {
				src: 'https://picsum.photos/seed/blog2/600/300',
				alt: '関連画像 2 — アクセシビリティツリー',
				width: 600,
				height: 300,
			},
		},
		carouselImg3: {
			type: 'Image',
			props: {
				src: 'https://picsum.photos/seed/blog3/600/300',
				alt: '関連画像 3 — AIエージェント操作フロー',
				width: 600,
				height: 300,
			},
		},

		/* ── 区切り線 ── */
		divider3: {
			type: 'Divider',
			props: {},
		},

		/* ── リアクション ── */
		reactionGroup: {
			type: 'ToggleGroup',
			props: {
				items: [
					{ value: 'like', label: '👍 いいね' },
					{ value: 'bookmark', label: '🔖 ブックマーク' },
					{ value: 'share', label: '🔗 共有' },
				],
				type: 'multiple',
				variant: 'outline',
			},
		},
		followToggle: {
			type: 'Toggle',
			props: {
				label: '著者をフォロー',
				variant: 'outline',
				pressed: '$state.following',
				onChange: '$action.toggleFollow',
			},
		},

		/* ── 区切り線 ── */
		divider4: {
			type: 'Divider',
			props: {},
		},

		/* ── リサイズ可能な 2 カラム ── */
		resizableSection: {
			type: 'Resizable',
			props: { direction: 'horizontal', sizes: [40, 60] },
			children: ['tocCard', 'relatedCard'],
		},
		tocCard: {
			type: 'Card',
			props: { title: '目次' },
			children: ['tocLinks'],
		},
		tocLinks: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['tocLink1', 'tocLink2', 'tocLink3', 'tocLink4'],
		},
		tocLink1: {
			type: 'Link',
			props: { href: '#', label: '1. はじめに' },
		},
		tocLink2: {
			type: 'Link',
			props: { href: '#', label: '2. コンポーネント設計の原則' },
		},
		tocLink3: {
			type: 'Link',
			props: { href: '#', label: '3. コード例' },
		},
		tocLink4: {
			type: 'Link',
			props: { href: '#', label: '4. まとめ' },
		},
		relatedCard: {
			type: 'Card',
			props: { title: '関連記事' },
			children: ['relatedList'],
		},
		relatedList: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['related1', 'related2', 'related3'],
		},
		related1: {
			type: 'Text',
			props: { content: 'アクセシビリティファースト開発の実践', size: 'sm' },
		},
		related2: {
			type: 'Text',
			props: { content: 'AIエージェントが操作するWebアプリの作り方', size: 'sm' },
		},
		related3: {
			type: 'Text',
			props: { content: 'デザインシステム構築ガイド 2024', size: 'sm' },
		},

		/* ── 記事公開スケジュール カレンダー ── */
		calendar: {
			type: 'Calendar',
			props: {
				defaultMonth: '2024-03',
				events: [
					{ date: '2024-03-01', label: '連載第1回 公開', color: '#3b82f6' },
					{ date: '2024-03-08', label: '連載第2回 公開', color: '#3b82f6' },
					{ date: '2024-03-15', label: 'この記事 公開', color: '#10b981' },
					{ date: '2024-03-22', label: '連載第4回 公開予定', color: '#f59e0b' },
					{ date: '2024-03-29', label: '連載最終回 公開予定', color: '#f59e0b' },
				],
			},
		},
	},
	state: {
		following: false,
	},
	actions: {
		toggleFollow: { type: 'setState', key: 'following' },
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'blog', 'content', 'typography', 'carousel', 'calendar', 'resizable'],
	},
};

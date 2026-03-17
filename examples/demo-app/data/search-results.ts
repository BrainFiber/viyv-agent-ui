import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * 検索結果風レイアウト デモページ
 * 検証: Stack align/justify (#1), Image objectFit (#2), Repeater + 横並びレイアウト, Pagination
 */
export const searchResultsSpec: PageSpec = {
	id: 'search-results-demo',
	title: '検索結果デモ',
	description: 'Stack align/justify + Image objectFit + Repeater ページネーションの検証用デモページ',
	hooks: {
		results: {
			use: 'useState',
			params: {
				initial: [
					{
						id: 1,
						site: 'example.com › docs › getting-started',
						url: '/pages/search-results-demo',
						title: 'はじめてのセットアップガイド — 初期設定から運用まで',
						description:
							'プロジェクトの初期設定方法を分かりやすく解説しています。環境構築、依存関係のインストール、設定ファイルの編集まで一通りの手順をカバーしています。',
						thumbnail: 'https://picsum.photos/seed/s1/240/160',
					},
					{
						id: 2,
						site: 'blog.example.org › 2024 › ui-components',
						url: '/pages/search-results-demo',
						title: 'モダンUIコンポーネント設計のベストプラクティス',
						description:
							'再利用可能なUIコンポーネントの設計パターンについて、実践的なアプローチを紹介。Atomic Design の考え方を取り入れた効率的な開発フローを解説します。',
						thumbnail: 'https://picsum.photos/seed/s2/240/160',
					},
					{
						id: 3,
						site: 'dev.to › tutorials › dashboard',
						url: '/pages/search-results-demo',
						title: 'データダッシュボードを30分で構築する方法',
						description:
							'リアルタイムデータを可視化するダッシュボードの構築チュートリアル。SQLクエリからチャート表示まで、実用的なサンプルコード付きで解説しています。',
						thumbnail: 'https://picsum.photos/seed/s3/240/160',
					},
					{
						id: 4,
						site: 'qiita.com › @engineer › responsive-layout',
						url: '/pages/search-results-demo',
						title: 'レスポンシブレイアウトの実装テクニック集',
						description:
							'Flexbox と CSS Grid を活用したレスポンシブデザインの実装パターンを網羅的にまとめました。モバイルファーストのアプローチで実践的なコード例を紹介。',
						thumbnail: 'https://picsum.photos/seed/s4/240/160',
					},
					{
						id: 5,
						site: 'zenn.dev › articles › image-optimization',
						url: '/pages/search-results-demo',
						title: 'Webパフォーマンスを向上させる画像最適化戦略',
						description:
							'Web サイトの表示速度を改善するための画像最適化テクニック。フォーマット選択、遅延読み込み、レスポンシブ画像の実装方法を詳しく解説しています。',
						thumbnail: 'https://picsum.photos/seed/s5/240/160',
					},
					{
						id: 6,
						site: 'tech.example.co.jp › engineering › api-design',
						url: '/pages/search-results-demo',
						title: 'RESTful API 設計の実践ガイドライン',
						description:
							'スケーラブルな REST API の設計原則を解説。エンドポイント命名規則、エラーハンドリング、バージョニング戦略をプロダクション事例とともに紹介します。',
						thumbnail: 'https://picsum.photos/seed/s6/240/160',
					},
					{
						id: 7,
						site: 'medium.com › @devops › container-orchestration',
						url: '/pages/search-results-demo',
						title: 'コンテナオーケストレーション入門 — Docker から Kubernetes へ',
						description:
							'コンテナ技術の基礎から Kubernetes クラスタの構築まで、段階的に学べるチュートリアル。マイクロサービスアーキテクチャの実践的な導入方法を解説。',
						thumbnail: 'https://picsum.photos/seed/s7/240/160',
					},
					{
						id: 8,
						site: 'note.com › techblog › testing-strategy',
						url: '/pages/search-results-demo',
						title: 'テスト戦略の全体設計 — ユニットからE2Eまで',
						description:
							'効果的なテストピラミッドの構築方法。ユニットテスト、統合テスト、E2Eテストの適切な比率と、CI/CDパイプラインへの組み込み方を実例付きで紹介。',
						thumbnail: 'https://picsum.photos/seed/s8/240/160',
					},
					{
						id: 9,
						site: 'speakerdeck.com › presentations › state-management',
						url: '/pages/search-results-demo',
						title: 'フロントエンド状態管理の最新トレンド 2026',
						description:
							'React Server Components 時代の状態管理を俯瞰。サーバー状態とクライアント状態の分離パターン、キャッシュ戦略、楽観的更新の実装アプローチを比較。',
						thumbnail: 'https://picsum.photos/seed/s9/240/160',
					},
					{
						id: 10,
						site: 'github.blog › engineering › monorepo',
						url: '/pages/search-results-demo',
						title: 'モノレポ運用のスケーリング戦略',
						description:
							'大規模モノレポの運用知見を共有。ビルドキャッシュ、依存関係管理、CI の高速化テクニック、チーム間のコード共有ベストプラクティスをまとめています。',
						thumbnail: 'https://picsum.photos/seed/s10/240/160',
					},
				],
			},
		},
	},
	root: 'page',
	elements: {
		page: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 24 },
			children: ['header', 'resultRepeater'],
		},
		header: {
			type: 'Header',
			props: {
				title: '検索結果',
				subtitle: 'Stack align + Image objectFit + ページネーション デモ',
				level: 1,
			},
		},
		resultRepeater: {
			type: 'Repeater',
			props: { data: '$hook.results', keyField: 'id', pageSize: 3 },
			children: ['resultRow'],
		},
		resultRow: {
			type: 'Stack',
			props: { direction: 'horizontal', align: 'start', gap: 12 },
			children: ['resultText', 'resultThumb'],
		},
		resultText: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 4, className: 'flex-1 min-w-0' },
			children: ['resultSite', 'resultLink', 'resultDesc'],
		},
		resultSite: {
			type: 'Text',
			props: { content: '$item.site', variant: 'caption', color: 'muted' },
		},
		resultLink: {
			type: 'Link',
			props: { href: '$item.url', label: '$item.title', external: true },
		},
		resultDesc: {
			type: 'Text',
			props: { content: '$item.description', variant: 'body', truncate: 2, color: 'muted' },
		},
		resultThumb: {
			type: 'Image',
			props: {
				src: '$item.thumbnail',
				alt: '$item.title',
				width: 120,
				height: 80,
				objectFit: 'cover',
				className: 'rounded shrink-0',
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'search', 'stack-align', 'image-objectfit', 'repeater', 'pagination'],
	},
};

import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * 商品詳細デモページ
 * 検証: Breadcrumbs, Carousel, Tag, Descriptions, Rating, Tooltip
 */
export const productDetailSpec: PageSpec = {
	id: 'product-detail-new',
	title: '商品詳細',
	description: 'Breadcrumbs, Carousel, Tag, Descriptions, Rating, Tooltip コンポーネントのデモ',
	hooks: {},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 24 },
			children: ['breadcrumbs', 'productGrid', 'specsCard'],
		},

		/* ── パンくずリスト ── */
		breadcrumbs: {
			type: 'Breadcrumbs',
			props: {
				items: [
					{ label: 'ホーム', href: '/pages/product-detail-new' },
					{ label: 'アウトドア用品', href: '/pages/product-detail-new' },
					{ label: 'ウルトラライトテント 2P' },
				],
			},
		},

		/* ── メイン 2 カラム ── */
		productGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 24 },
			children: ['imageCard', 'infoCard'],
		},

		/* ── 左カラム: 画像カルーセル ── */
		imageCard: {
			type: 'Card',
			props: {},
			children: ['carousel'],
		},
		carousel: {
			type: 'Carousel',
			props: { showDots: true, showArrows: true },
			children: ['slide1', 'slide2', 'slide3'],
		},
		slide1: {
			type: 'Image',
			props: {
				src: 'https://picsum.photos/seed/product1/600/400',
				alt: '商品画像 1 — テント全体',
				width: 600,
				height: 400,
			},
		},
		slide2: {
			type: 'Image',
			props: {
				src: 'https://picsum.photos/seed/product2/600/400',
				alt: '商品画像 2 — 内部構造',
				width: 600,
				height: 400,
			},
		},
		slide3: {
			type: 'Image',
			props: {
				src: 'https://picsum.photos/seed/product3/600/400',
				alt: '商品画像 3 — 収納時',
				width: 600,
				height: 400,
			},
		},

		/* ── 右カラム: 商品情報 ── */
		infoCard: {
			type: 'Card',
			props: {},
			children: ['infoStack'],
		},
		infoStack: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 16 },
			children: ['productTitle', 'tagRow', 'priceText', 'ratingSection', 'addToCartTooltip'],
		},
		productTitle: {
			type: 'Header',
			props: {
				title: 'ウルトラライトテント 2P',
				subtitle: '超軽量ダブルウォール自立式テント',
				level: 2,
			},
		},
		tagRow: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8 },
			children: ['tagNew', 'tagFreeShipping', 'tagSale'],
		},
		tagNew: {
			type: 'Tag',
			props: { label: '新着', color: 'blue' },
		},
		tagFreeShipping: {
			type: 'Tag',
			props: { label: '送料無料', color: 'green' },
		},
		tagSale: {
			type: 'Tag',
			props: { label: 'セール', color: 'red' },
		},
		priceText: {
			type: 'Text',
			props: {
				content: '¥39,800（税込）',
				variant: 'heading',
				weight: 'bold',
			},
		},
		ratingSection: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 4 },
			children: ['ratingInput', 'ratingCaption'],
		},
		ratingInput: {
			type: 'Rating',
			props: {
				value: '$bindState.rating',
				max: 5,
				label: 'カスタマー評価',
				onChange: '$action.setRating',
			},
		},
		ratingCaption: {
			type: 'Text',
			props: { content: '4.0 / 5.0（128件のレビュー）', variant: 'caption', color: 'muted' },
		},
		addToCartTooltip: {
			type: 'Tooltip',
			props: { content: '在庫あり: すぐにお届けできます', position: 'bottom' },
			children: ['addToCartBtn'],
		},
		addToCartBtn: {
			type: 'Button',
			props: { label: 'カートに追加', variant: 'primary' },
		},

		/* ── 商品スペック ── */
		specsCard: {
			type: 'Card',
			props: { title: '商品スペック' },
			children: ['specsDescriptions'],
		},
		specsDescriptions: {
			type: 'Descriptions',
			props: {
				columns: 2,
				bordered: true,
				layout: 'horizontal',
				items: [
					{ label: 'ブランド', value: 'VIYV Outdoor' },
					{ label: 'サイズ', value: '210 × 130 × 105 cm（設営時）' },
					{ label: '重量', value: '1.35 kg' },
					{ label: '素材', value: '20D リップストップナイロン / DAC Featherlite NSL ポール' },
					{ label: '原産国', value: '日本' },
				],
			},
		},
	},
	state: { rating: 4 },
	actions: {
		setRating: { type: 'setState', key: 'rating' },
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'product'],
	},
};

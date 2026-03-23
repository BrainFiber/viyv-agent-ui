import type { PageSpec } from '@viyv/agent-ui-schema';

export const ecommerceProductSpec: PageSpec = {
	id: 'ecommerce-product',
	title: '商品詳細ページ',
	description: 'EC商品詳細 — カルーセル、レビュー、関連商品を含むフルページ',
	hooks: {
		reviews: {
			use: 'useState',
			params: {
				initial: [
					{ reviewer: '山田 太郎', date: '2026-03-10', rating: '★★★★★', comment: 'ノイズキャンセリングの性能が素晴らしい。長時間使用しても疲れません。' },
					{ reviewer: '鈴木 花子', date: '2026-03-05', rating: '★★★★☆', comment: '音質は最高ですが、価格がやや高いと感じました。' },
					{ reviewer: '佐藤 健一', date: '2026-02-28', rating: '★★★★★', comment: 'ペアリングが簡単で、マルチポイント接続も便利です。' },
					{ reviewer: '田中 美咲', date: '2026-02-20', rating: '★★★☆☆', comment: '装着感は良いですが、風切り音が気になることがあります。' },
				],
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Container',
			props: { maxWidth: 1200 },
			children: ['mainStack'],
		},
		mainStack: {
			type: 'Stack',
			props: { gap: 8 },
			children: ['breadcrumbs', 'productGrid', 'divider', 'reviewsCard', 'relatedCard', 'toastContainer', 'toast'],
		},

		// Breadcrumbs
		breadcrumbs: {
			type: 'Breadcrumbs',
			props: {
				items: [
					{ label: 'ホーム', href: '/' },
					{ label: '家電', href: '/category/electronics' },
					{ label: 'ヘッドホン', href: '/category/headphones' },
					{ label: 'WH-1000XM5' },
				],
			},
		},

		// Product Grid
		productGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 8 },
			children: ['productCarousel', 'productInfo'],
		},

		// Left: Carousel
		productCarousel: {
			type: 'Carousel',
			props: { showDots: true, showArrows: true },
			children: ['productImg1', 'productImg2', 'productImg3', 'productImg4'],
		},
		productImg1: {
			type: 'Image',
			props: { src: 'https://placehold.co/600x400/1a1a2e/e0e0e0?text=WH-1000XM5+Front', alt: 'WH-1000XM5 正面' },
		},
		productImg2: {
			type: 'Image',
			props: { src: 'https://placehold.co/600x400/16213e/e0e0e0?text=WH-1000XM5+Side', alt: 'WH-1000XM5 側面' },
		},
		productImg3: {
			type: 'Image',
			props: { src: 'https://placehold.co/600x400/0f3460/e0e0e0?text=WH-1000XM5+Detail', alt: 'WH-1000XM5 詳細' },
		},
		productImg4: {
			type: 'Image',
			props: { src: 'https://placehold.co/600x400/533483/e0e0e0?text=WH-1000XM5+Case', alt: 'WH-1000XM5 ケース' },
		},

		// Right: Product Info
		productInfo: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['productHeader', 'stockBadge', 'priceText', 'productRating', 'tagStack', 'productDescriptions', 'actionStack'],
		},
		productHeader: {
			type: 'Header',
			props: { title: 'Sony WH-1000XM5', subtitle: 'ワイヤレスノイズキャンセリングヘッドホン' },
		},
		stockBadge: {
			type: 'Badge',
			props: { text: '在庫あり', color: 'green' },
		},
		priceText: {
			type: 'Text',
			props: { content: '¥44,000', variant: 'heading' },
		},
		productRating: {
			type: 'Rating',
			props: { value: 4.5, max: 5, label: '評価' },
		},
		tagStack: {
			type: 'Stack',
			props: { gap: 2, direction: 'horizontal' },
			children: ['tag1', 'tag2', 'tag3'],
		},
		tag1: {
			type: 'Tag',
			props: { label: 'ワイヤレス', color: 'blue' },
		},
		tag2: {
			type: 'Tag',
			props: { label: 'ノイキャン', color: 'green' },
		},
		tag3: {
			type: 'Tag',
			props: { label: 'Bluetooth 5.3', color: 'gray' },
		},
		productDescriptions: {
			type: 'Descriptions',
			props: {
				items: [
					{ label: '重量', value: '250g' },
					{ label: 'バッテリー', value: '30時間' },
					{ label: 'ドライバー', value: '30mm' },
					{ label: '対応コーデック', value: 'LDAC / AAC' },
				],
				bordered: true,
			},
		},
		actionStack: {
			type: 'Stack',
			props: { gap: 2, direction: 'horizontal' },
			children: ['addToCartButton', 'wishlistTooltip'],
		},
		addToCartButton: {
			type: 'Button',
			props: { label: 'カートに追加', variant: 'primary', onClick: '$action.addToCart' },
		},
		wishlistTooltip: {
			type: 'Tooltip',
			props: { content: 'お気に入りに追加' },
			children: ['wishlistButton'],
		},
		wishlistButton: {
			type: 'Button',
			props: { label: '♡', variant: 'outline' },
		},

		// Divider
		divider: {
			type: 'Divider',
			props: {},
		},

		// Reviews
		reviewsCard: {
			type: 'Card',
			props: { title: 'カスタマーレビュー' },
			children: ['reviewsTable'],
		},
		reviewsTable: {
			type: 'Table',
			props: {
				columns: [
					{ key: 'reviewer', label: 'レビュアー' },
					{ key: 'date', label: '日付' },
					{ key: 'rating', label: '評価' },
					{ key: 'comment', label: 'コメント' },
				],
				data: '$hook.reviews',
				striped: true,
			},
		},

		// Related Products
		relatedCard: {
			type: 'Card',
			props: { title: '関連商品' },
			children: ['relatedGrid'],
		},
		relatedGrid: {
			type: 'Grid',
			props: { columns: 4, gap: 4 },
			children: ['related1', 'related2', 'related3', 'related4'],
		},
		related1: {
			type: 'Card',
			props: {},
			children: ['related1Stack'],
		},
		related1Stack: {
			type: 'Stack',
			props: { gap: 2 },
			children: ['related1Img', 'related1Name', 'related1Price', 'related1Link'],
		},
		related1Img: {
			type: 'Image',
			props: { src: 'https://placehold.co/300x200/2c3e50/e0e0e0?text=WF-1000XM5', alt: 'WF-1000XM5' },
		},
		related1Name: {
			type: 'Text',
			props: { content: 'WF-1000XM5' },
		},
		related1Price: {
			type: 'Text',
			props: { content: '¥36,000' },
		},
		related1Link: {
			type: 'Link',
			props: { href: '/pages/ecommerce-product', label: '詳細を見る' },
		},
		related2: {
			type: 'Card',
			props: {},
			children: ['related2Stack'],
		},
		related2Stack: {
			type: 'Stack',
			props: { gap: 2 },
			children: ['related2Img', 'related2Name', 'related2Price', 'related2Link'],
		},
		related2Img: {
			type: 'Image',
			props: { src: 'https://placehold.co/300x200/34495e/e0e0e0?text=WH-1000XM4', alt: 'WH-1000XM4' },
		},
		related2Name: {
			type: 'Text',
			props: { content: 'WH-1000XM4' },
		},
		related2Price: {
			type: 'Text',
			props: { content: '¥33,000' },
		},
		related2Link: {
			type: 'Link',
			props: { href: '/pages/ecommerce-product', label: '詳細を見る' },
		},
		related3: {
			type: 'Card',
			props: {},
			children: ['related3Stack'],
		},
		related3Stack: {
			type: 'Stack',
			props: { gap: 2 },
			children: ['related3Img', 'related3Name', 'related3Price', 'related3Link'],
		},
		related3Img: {
			type: 'Image',
			props: { src: 'https://placehold.co/300x200/1abc9c/e0e0e0?text=MDR-MV1', alt: 'MDR-MV1' },
		},
		related3Name: {
			type: 'Text',
			props: { content: 'MDR-MV1' },
		},
		related3Price: {
			type: 'Text',
			props: { content: '¥48,000' },
		},
		related3Link: {
			type: 'Link',
			props: { href: '/pages/ecommerce-product', label: '詳細を見る' },
		},
		related4: {
			type: 'Card',
			props: {},
			children: ['related4Stack'],
		},
		related4Stack: {
			type: 'Stack',
			props: { gap: 2 },
			children: ['related4Img', 'related4Name', 'related4Price', 'related4Link'],
		},
		related4Img: {
			type: 'Image',
			props: { src: 'https://placehold.co/300x200/e74c3c/e0e0e0?text=LinkBuds+S', alt: 'LinkBuds S' },
		},
		related4Name: {
			type: 'Text',
			props: { content: 'LinkBuds S' },
		},
		related4Price: {
			type: 'Text',
			props: { content: '¥26,000' },
		},
		related4Link: {
			type: 'Link',
			props: { href: '/pages/ecommerce-product', label: '詳細を見る' },
		},

		// Toast
		toastContainer: {
			type: 'ToastContainer',
			props: {},
		},
		toast: {
			type: 'Toast',
			props: { message: 'カートに追加しました', type: 'success' },
			visible: { expr: '$state.showCartToast' },
		},
	},
	state: {
		showCartToast: false,
	},
	actions: {
		addToCart: { type: 'setState', key: 'showCartToast', value: true },
	},
	meta: { tags: ['ecommerce', 'product', 'demo'] },
};

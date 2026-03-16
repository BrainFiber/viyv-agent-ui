import type { PageSpec } from '@viyv/agent-ui-schema';
import { datasets } from '../lib/demo-data';

/**
 * EC商品詳細ページ
 * 検証: searchParams (#6) — $hook._params.id で URL ?id=xxx を取得
 *       Image (#4)
 */
export const ecProductDetailSpec: PageSpec = {
	id: 'ec-product-detail',
	title: 'EC 商品詳細',
	description:
		'URLクエリパラメータ ($hook._params.id) から商品IDを取得し詳細を表示。searchParamsパイプラインの検証。',
	hooks: {
		allProducts: {
			use: 'useState',
			params: { initial: datasets.products.rows },
		},
		allSales: {
			use: 'useState',
			params: { initial: datasets.sales.rows },
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 24 },
			children: ['header', 'backLink', 'infoGrid', 'salesCard'],
		},
		header: {
			type: 'Header',
			props: {
				title: '商品詳細',
				subtitle: 'URLパラメータ: $hook._params.id で商品を特定（例: ?id=P001）',
			},
		},
		backLink: {
			type: 'Link',
			props: { href: '/pages/ec-product-list', label: '← 商品一覧へ戻る' },
		},
		infoGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['imageCard', 'detailCard'],
		},
		imageCard: {
			type: 'Card',
			props: { title: '商品画像' },
			children: ['productImage'],
		},
		productImage: {
			type: 'Image',
			props: {
				src: 'https://placehold.co/400x300/e2e8f0/64748b?text=Product+Image',
				alt: '商品画像',
				width: 400,
				height: 300,
			},
		},
		detailCard: {
			type: 'Card',
			props: { title: '商品情報' },
			children: ['detailStack'],
		},
		detailStack: {
			type: 'Stack',
			props: { gap: 12 },
			children: ['paramText', 'productTable'],
		},
		paramText: {
			type: 'Text',
			props: {
				content: '下記テーブルは全商品を表示しています。searchParams 経由の `$hook._params.id` によるフィルタは expression evaluator でサポートされます。',
			},
		},
		productTable: {
			type: 'DataTable',
			props: {
				data: '$hook.allProducts',
				keyField: 'id',
				columns: [
					{ key: 'id', label: 'ID' },
					{ key: 'name', label: '商品名' },
					{ key: 'category', label: 'カテゴリ' },
					{ key: 'price', label: '単価', format: 'currency' },
					{ key: 'stock', label: '在庫', format: 'number' },
				],
			},
		},
		salesCard: {
			type: 'Card',
			props: { title: '売上履歴' },
			children: ['salesTable'],
		},
		salesTable: {
			type: 'DataTable',
			props: {
				data: '$hook.allSales',
				keyField: 'id',
				columns: [
					{ key: 'date', label: '日付', sortable: true, format: 'date', minWidth: 110 },
					{ key: 'product', label: '商品', sortable: true },
					{ key: 'quantity', label: '数量', sortable: true },
					{ key: 'amount', label: '金額', sortable: true, format: 'currency' },
					{ key: 'customer', label: '顧客' },
				],
			},
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'ec', 'detail', 'searchParams'],
	},
};

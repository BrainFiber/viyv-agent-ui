import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * 店舗マップ デモページ
 * 検証: Map コンポーネント + Repeater による店舗リスト表示
 */
export const storeLocatorSpec: PageSpec = {
	id: 'store-locator',
	title: '店舗マップ',
	description: 'Map コンポーネント + Repeater の検証用デモページ',
	hooks: {
		stores: {
			use: 'useState',
			params: {
				initial: [
					{
						id: 1,
						name: '渋谷店',
						address: '東京都渋谷区道玄坂1-2-3',
						lat: 35.6580,
						lng: 139.7016,
						hours: '10:00〜21:00',
						phone: '03-1234-5678',
					},
					{
						id: 2,
						name: '新宿店',
						address: '東京都新宿区西新宿1-1-1',
						lat: 35.6896,
						lng: 139.6922,
						hours: '10:00〜22:00',
						phone: '03-2345-6789',
					},
					{
						id: 3,
						name: '池袋店',
						address: '東京都豊島区南池袋1-28-1',
						lat: 35.7295,
						lng: 139.7109,
						hours: '10:00〜21:00',
						phone: '03-3456-7890',
					},
					{
						id: 4,
						name: '東京駅前店',
						address: '東京都千代田区丸の内1-9-1',
						lat: 35.6812,
						lng: 139.7671,
						hours: '08:00〜22:00',
						phone: '03-4567-8901',
					},
					{
						id: 5,
						name: '品川店',
						address: '東京都港区高輪3-26-27',
						lat: 35.6284,
						lng: 139.7387,
						hours: '09:00〜21:00',
						phone: '03-5678-9012',
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
			children: ['header', 'mainGrid'],
		},
		header: {
			type: 'Header',
			props: { title: '店舗マップ', subtitle: '東京エリアの店舗一覧', level: 1 },
		},
		mainGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['mapCard', 'listCard'],
		},
		mapCard: {
			type: 'Card',
			props: { title: '店舗マップ' },
			children: ['storeMap'],
		},
		storeMap: {
			type: 'Map',
			props: {
				center: [35.68, 139.74],
				zoom: 12,
				markers: '$hook.stores',
				labelKey: 'name',
				popupKey: 'address',
				height: 500,
			},
		},
		listCard: {
			type: 'Card',
			props: { title: '店舗一覧' },
			children: ['storeRepeater'],
		},
		storeRepeater: {
			type: 'Repeater',
			props: { data: '$hook.stores', keyField: 'id' },
			children: ['storeItem'],
		},
		storeItem: {
			type: 'Card',
			props: {},
			children: ['storeName', 'storeAddress', 'storeInfo'],
		},
		storeName: {
			type: 'Text',
			props: { content: '$item.name', variant: 'subheading', weight: 'semibold' },
		},
		storeAddress: {
			type: 'Text',
			props: { content: '$item.address', variant: 'body', color: 'muted' },
		},
		storeInfo: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 16 },
			children: ['storeHours', 'storePhone'],
		},
		storeHours: {
			type: 'Text',
			props: { content: '$item.hours', variant: 'caption', color: 'muted' },
		},
		storePhone: {
			type: 'Text',
			props: { content: '$item.phone', variant: 'caption', color: 'primary' },
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'map', 'store-locator', 'leaflet'],
	},
};

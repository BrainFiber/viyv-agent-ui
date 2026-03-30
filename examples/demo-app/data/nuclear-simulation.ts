import type { PageSpec } from '@viyv/agent-ui-schema';

export const nuclearSimulationSpec: PageSpec = {
	id: 'nuclear-simulation',
	title: '核汚染シミュレーション',
	description: 'Map オーバーレイ（Circle / Polyline）を使った原発事故汚染範囲の可視化デモ',
	root: 'root',
	state: {},
	hooks: {
		vessels: {
			use: 'useWebSocket' as const,
			params: {
				url: 'wss://stream.aisstream.io/v0/stream',
				subscribe: {
					Apikey: '$secret.AISSTREAM_KEY',
					BoundingBoxes: [[[25, 47], [31, 57]]],
					FilterMessageTypes: ['PositionReport'],
				},
				bufferSize: 50,
				refreshInterval: 5000,
				messageKey: 'MetaData',
			},
		},
	},
	actions: {},
	meta: { tags: ['demo', 'map', 'overlay', 'simulation', 'circle', 'polyline'] },
	elements: {
		// ── Root ──
		root: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 0 },
			children: ['hero', 'mapSection', 'vesselSection', 'legendSection'],
		},

		// ══════════════════════════════════════════════
		// Hero — ダーク背景 + 警告タイトル
		// ══════════════════════════════════════════════
		hero: {
			type: 'Section',
			props: {
				variant: 'hero',
				bgGradient: { from: '#1a1a2e', to: '#16213e', via: '#0f3460', direction: 'to-br' },
				minHeight: 'quarter',
				align: 'center',
				justify: 'center',
				maxWidth: 'lg',
				px: 24,
			},
			children: ['hero-overline', 'hero-title', 'hero-subtitle'],
		},
		'hero-overline': {
			type: 'Text',
			props: {
				content: 'MAP OVERLAY DEMO',
				variant: 'overline',
				color: 'primary',
				align: 'center',
			},
		},
		'hero-title': {
			type: 'Text',
			props: {
				content: 'Bushehr NPP — 核汚染シミュレーション',
				variant: 'display',
				size: 'lg',
				align: 'center',
				textGradient: { from: '#ff7043', to: '#ffca28' },
			},
		},
		'hero-subtitle': {
			type: 'Text',
			props: {
				content: '運転中の VVER-1000 原子炉が損傷した場合の放射能汚染範囲を推定。Circle / Polyline オーバーレイで可視化。',
				variant: 'body',
				size: 'lg',
				align: 'center',
				color: 'muted',
			},
		},

		// ══════════════════════════════════════════════
		// Map Section
		// ══════════════════════════════════════════════
		mapSection: {
			type: 'Section',
			props: {
				variant: 'content',
				maxWidth: 'xl',
				py: 32,
				px: 24,
			},
			children: ['mapDisclaimer', 'mapCard'],
		},
		mapDisclaimer: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center', py: 4 },
			children: ['mapDisclaimerBadge', 'mapDisclaimerText'],
		},
		mapDisclaimerBadge: {
			type: 'Badge',
			props: { text: 'SIMULATION', color: 'yellow' },
		},
		mapDisclaimerText: {
			type: 'Text',
			props: {
				content: 'デモ用シミュレーションです。実際の拡散は気象条件・地形・炉の状態により大きく異なります。',
				variant: 'body',
				size: 'sm',
				color: 'muted',
			},
		},
		mapCard: {
			type: 'Card',
			props: { shadow: 'lg', p: 0 },
			children: ['map'],
		},
		map: {
			type: 'Map',
			props: {
				center: [28.83, 50.89],
				zoom: 8,
				height: 600,
				markers: [
					{ lat: 28.83, lng: 50.89, label: 'Bushehr NPP', popup: 'ブーシェフル原子力発電所 (VVER-1000)\nイラン唯一の商用原子炉' },
					{ lat: 29.59, lng: 52.58, label: 'Shiraz', popup: '人口約190万 — 原発から約200km' },
					{ lat: 28.97, lng: 50.84, label: 'Bushehr市', popup: '人口約25万 — 原発から約17km' },
					{ lat: 30.28, lng: 48.3, label: 'Basra (イラク)', popup: '人口約280万 — 国境を越えた影響の可能性' },
					{ lat: 29.07, lng: 50.15, label: 'Ganaveh', popup: '人口約8万 — 原発から約80km' },
				],
				overlays: [
					{ type: 'circle', center: [28.83, 50.89], radius: 200000, color: '#fff176', fillColor: '#fff176', fillOpacity: 0.06, weight: 1, opacity: 0.6, label: '長期影響圏 (200km)' },
					{ type: 'circle', center: [28.83, 50.89], radius: 80000, color: '#ffb74d', fillColor: '#ffb74d', fillOpacity: 0.1, weight: 1, opacity: 0.7, label: '汚染監視区域 (80km)' },
					{ type: 'circle', center: [28.83, 50.89], radius: 30000, color: '#ff7043', fillColor: '#ff7043', fillOpacity: 0.18, weight: 2, label: '屋内退避区域 (30km)' },
					{ type: 'circle', center: [28.83, 50.89], radius: 10000, color: '#d32f2f', fillColor: '#d32f2f', fillOpacity: 0.3, weight: 2, label: '即時避難区域 (10km)' },
					{ type: 'polyline', positions: [[28.83, 50.89], [28.95, 50.75], [29.1, 50.6], [29.3, 50.45]], color: '#42a5f5', weight: 4, dashArray: '10,6', label: '避難経路 北西' },
					{ type: 'polyline', positions: [[28.83, 50.89], [28.6, 51.1], [28.35, 51.4]], color: '#42a5f5', weight: 4, dashArray: '10,6', label: '避難経路 南東' },
				],
			},
		},

		// ══════════════════════════════════════════════
		// Vessel Section — useWebSocket でリアルタイムタンカー位置
		// ══════════════════════════════════════════════
		vesselSection: {
			type: 'Section',
			props: {
				variant: 'content',
				maxWidth: 'xl',
				py: 16,
				px: 24,
			},
			children: ['vesselTitle', 'vesselCard'],
		},
		vesselTitle: {
			type: 'Text',
			props: { content: '近海タンカー運行状況（リアルタイム）', variant: 'heading', size: 'lg' },
		},
		vesselCard: {
			type: 'Card',
			props: { shadow: 'lg', p: 0 },
			children: ['vesselMap'],
		},
		vesselMap: {
			type: 'Map',
			props: {
				center: [27.5, 52.0],
				zoom: 6,
				height: 400,
				markers: '$hook.vessels.messages',
				latKey: 'latitude',
				lngKey: 'longitude',
				labelKey: 'ShipName',
				popupKey: 'ShipName',
			},
		},

		// ══════════════════════════════════════════════
		// Legend Section — 色付きバッジ付き凡例
		// ══════════════════════════════════════════════
		legendSection: {
			type: 'Section',
			props: {
				variant: 'content',
				maxWidth: 'xl',
				py: 16,
				px: 24,
			},
			children: ['legendTitle', 'legendGrid'],
		},
		legendTitle: {
			type: 'Text',
			props: { content: '汚染ゾーン凡例', variant: 'heading', size: 'lg' },
		},
		legendGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['zone1', 'zone2', 'zone3', 'zone4'],
		},

		// Zone cards
		zone1: {
			type: 'Card',
			props: { p: 6, border: true },
			children: ['zone1-header', 'zone1-desc'],
		},
		'zone1-header': {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center' },
			children: ['zone1-badge', 'zone1-title'],
		},
		'zone1-badge': {
			type: 'Badge',
			props: { text: '10km', color: 'red' },
		},
		'zone1-title': {
			type: 'Text',
			props: { content: '即時避難区域', variant: 'heading', size: 'sm' },
		},
		'zone1-desc': {
			type: 'Text',
			props: { content: '致命的な放射線量レベル。即時避難が必要。VVER-1000 炉心溶融時の直接被曝圏。', variant: 'body', size: 'sm', color: 'muted' },
		},

		zone2: {
			type: 'Card',
			props: { p: 6, border: true },
			children: ['zone2-header', 'zone2-desc'],
		},
		'zone2-header': {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center' },
			children: ['zone2-badge', 'zone2-title'],
		},
		'zone2-badge': {
			type: 'Badge',
			props: { text: '30km', color: 'yellow' },
		},
		'zone2-title': {
			type: 'Text',
			props: { content: '屋内退避区域', variant: 'heading', size: 'sm' },
		},
		'zone2-desc': {
			type: 'Text',
			props: { content: '屋内退避指示。窓を閉め、外気の流入を遮断。安定ヨウ素剤の服用が推奨される。', variant: 'body', size: 'sm', color: 'muted' },
		},

		zone3: {
			type: 'Card',
			props: { p: 6, border: true },
			children: ['zone3-header', 'zone3-desc'],
		},
		'zone3-header': {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center' },
			children: ['zone3-badge', 'zone3-title'],
		},
		'zone3-badge': {
			type: 'Badge',
			props: { text: '80km', color: 'blue' },
		},
		'zone3-title': {
			type: 'Text',
			props: { content: '汚染監視区域', variant: 'heading', size: 'sm' },
		},
		'zone3-desc': {
			type: 'Text',
			props: { content: '放射性降下物（セシウム137、ストロンチウム90等）の沈着可能性。環境モニタリング強化。', variant: 'body', size: 'sm', color: 'muted' },
		},

		zone4: {
			type: 'Card',
			props: { p: 6, border: true },
			children: ['zone4-header', 'zone4-desc'],
		},
		'zone4-header': {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, align: 'center' },
			children: ['zone4-badge', 'zone4-title'],
		},
		'zone4-badge': {
			type: 'Badge',
			props: { text: '200km', color: 'gray' },
		},
		'zone4-title': {
			type: 'Text',
			props: { content: '長期影響圏', variant: 'heading', size: 'sm' },
		},
		'zone4-desc': {
			type: 'Text',
			props: { content: '長期的な健康影響の可能性。農産物・水源の検査が必要。Shiraz市を含む広域。', variant: 'body', size: 'sm', color: 'muted' },
		},
	},
};

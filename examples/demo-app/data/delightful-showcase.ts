import type { PageSpec } from '@viyv/agent-ui-schema';

export const delightfulShowcaseSpec: PageSpec = {
	id: 'delightful-showcase',
	title: 'Delightful Frontend ショーケース',
	description: 'Section, グラデーション, テキストグラデーション, アニメーション, ホバーエフェクトの新機能デモ',
	root: 'root',
	theme: {
		colorScheme: 'auto',
		spacing: 'default',
		accentColor: '#6366f1',
		fontFamily: { primary: 'Inter' },
		borderRadius: 'lg',
	},
	state: {},
	hooks: {},
	actions: {},
	meta: { tags: ['demo', 'showcase', 'delightful', 'section', 'animation'] },
	elements: {
		// ── Root ──
		root: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 0 },
			children: ['hero', 'features', 'animations', 'cta'],
		},

		// ══════════════════════════════════════════════
		// Hero Section — ダークグラデーション背景 + テキストグラデーション
		// ══════════════════════════════════════════════
		hero: {
			type: 'Section',
			props: {
				variant: 'hero',
				bgGradient: { from: '#0f172a', to: '#1e1b4b', via: '#172554', direction: 'to-br' },
				minHeight: 'half',
				align: 'center',
				justify: 'center',
				maxWidth: 'lg',
				px: 24,
			},
			children: ['hero-overline', 'hero-title', 'hero-subtitle', 'hero-buttons'],
		},
		'hero-overline': {
			type: 'Text',
			props: { content: 'VIYV AGENT UI', variant: 'overline', color: 'primary', align: 'center' },
		},
		'hero-title': {
			type: 'Text',
			props: {
				content: 'Delightful Frontends, Declared in JSON',
				as: 'h1',
				variant: 'display',
				size: '5xl',
				align: 'center',
				textGradient: { from: '#c7d2fe', to: '#818cf8', direction: 'to bottom right' },
			},
		},
		'hero-subtitle': {
			type: 'Text',
			props: {
				content: 'AI がページ仕様を書くだけで、グラデーション背景・アニメーション・ホバーエフェクトを備えたモダンな UI を自動生成。',
				size: 'lg',
				color: 'muted',
				align: 'center',
			},
		},
		'hero-buttons': {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 16, justify: 'center', py: 16, animate: 'fadeUp', animateDelay: 200 },
			children: ['hero-btn-primary', 'hero-btn-secondary'],
		},
		'hero-btn-primary': {
			type: 'Button',
			props: { label: 'Get Started', variant: 'primary', size: 'lg' },
		},
		'hero-btn-secondary': {
			type: 'Button',
			props: { label: 'Learn More', variant: 'outline', size: 'lg' },
		},

		// ══════════════════════════════════════════════
		// Features Section — Overline + Display + カード Grid
		// ══════════════════════════════════════════════
		features: {
			type: 'Section',
			props: { variant: 'feature', bg: 'surface', maxWidth: 'xl', px: 24 },
			children: ['features-header', 'features-grid'],
		},
		'features-header': {
			type: 'Stack',
			props: { direction: 'vertical', gap: 8, align: 'center', animate: 'fadeUp' },
			children: ['features-overline', 'features-title', 'features-desc'],
		},
		'features-overline': {
			type: 'Text',
			props: { content: 'FEATURES', variant: 'overline', color: 'primary', align: 'center' },
		},
		'features-title': {
			type: 'Text',
			props: { content: '宣言的に、美しく。', as: 'h2', variant: 'display', size: '4xl', align: 'center' },
		},
		'features-desc': {
			type: 'Text',
			props: { content: 'PageSpec JSON だけで、これまでコードが必要だったデザイン表現を実現します。', size: 'lg', color: 'muted', align: 'center' },
		},
		'features-grid': {
			type: 'Grid',
			props: { columns: 3, gap: 24 },
			children: ['feat-section', 'feat-gradient', 'feat-animation'],
		},
		'feat-section': {
			type: 'Card',
			props: {
				title: 'Section & Hero',
				description: 'Full-bleed ヒーロー、グラデーション背景、画像背景、オーバーレイ対応',
				hoverEffect: 'lift',
				animate: 'fadeUp',
			},
		},
		'feat-gradient': {
			type: 'Card',
			props: {
				title: 'Text Gradient',
				description: 'Display / Overline バリアント + テキストグラデーション対応',
				hoverEffect: 'glow',
				animate: 'fadeUp',
				animateDelay: 100,
			},
		},
		'feat-animation': {
			type: 'Card',
			props: {
				title: 'Entrance Animation',
				description: '6種のエントランスアニメーション + スクロールトリガー対応',
				hoverEffect: 'scale',
				animate: 'fadeUp',
				animateDelay: 200,
			},
		},

		// ══════════════════════════════════════════════
		// Animations Section — slideLeft / scaleIn / slideRight 比較
		// ══════════════════════════════════════════════
		animations: {
			type: 'Section',
			props: {
				variant: 'content',
				bgGradient: { from: '#f8fafc', to: '#eef2ff', direction: 'to-b' },
				maxWidth: 'xl',
				px: 24,
			},
			children: ['anim-title', 'anim-grid'],
		},
		'anim-title': {
			type: 'Text',
			props: {
				content: 'アニメーション比較',
				as: 'h2',
				variant: 'display',
				size: '3xl',
				align: 'center',
				textGradient: { from: '#6366f1', to: '#a855f7' },
			},
		},
		'anim-grid': {
			type: 'Grid',
			props: { columns: 3, gap: 24, py: 32 },
			children: ['anim-left', 'anim-scale', 'anim-right'],
		},
		'anim-left': {
			type: 'Box',
			props: { p: 32, rounded: 'xl', shadow: 'md', bg: 'surface', border: true, animate: 'slideLeft', hoverEffect: 'lift' },
			children: ['anim-left-title', 'anim-left-desc'],
		},
		'anim-left-title': {
			type: 'Text',
			props: { content: 'slideLeft', variant: 'heading' },
		},
		'anim-left-desc': {
			type: 'Text',
			props: { content: '左からスライドイン。ナビゲーションやサイドパネルに最適。', color: 'muted' },
		},
		'anim-scale': {
			type: 'Box',
			props: { p: 32, rounded: 'xl', shadow: 'md', bg: 'surface', border: true, animate: 'scaleIn', animateDelay: 150, hoverEffect: 'glow' },
			children: ['anim-scale-title', 'anim-scale-desc'],
		},
		'anim-scale-title': {
			type: 'Text',
			props: { content: 'scaleIn', variant: 'heading' },
		},
		'anim-scale-desc': {
			type: 'Text',
			props: { content: 'スケールインで登場。モーダルやフォーカス要素に効果的。', color: 'muted' },
		},
		'anim-right': {
			type: 'Box',
			props: { p: 32, rounded: 'xl', shadow: 'md', bg: 'surface', border: true, animate: 'slideRight', animateDelay: 300, hoverEffect: 'scale' },
			children: ['anim-right-title', 'anim-right-desc'],
		},
		'anim-right-title': {
			type: 'Text',
			props: { content: 'slideRight', variant: 'heading' },
		},
		'anim-right-desc': {
			type: 'Text',
			props: { content: '右からスライドイン。コンテンツの段階的表示に最適。', color: 'muted' },
		},

		// ══════════════════════════════════════════════
		// CTA Section — 紫グラデーション背景 + テキストグラデーション
		// ══════════════════════════════════════════════
		cta: {
			type: 'Section',
			props: {
				variant: 'cta',
				bgGradient: { from: '#4f46e5', to: '#7c3aed', direction: 'to-r' },
				align: 'center',
				maxWidth: 'md',
				px: 24,
			},
			children: ['cta-title', 'cta-desc', 'cta-buttons'],
		},
		'cta-title': {
			type: 'Text',
			props: {
				content: '今すぐ始めよう',
				as: 'h2',
				variant: 'display',
				size: '4xl',
				align: 'center',
				textGradient: { from: '#ffffff', to: '#c7d2fe' },
			},
		},
		'cta-desc': {
			type: 'Text',
			props: {
				content: 'PageSpec を書くだけで AI がこの品質の UI を生成します。',
				size: 'lg',
				color: 'muted',
				align: 'center',
			},
		},
		'cta-buttons': {
			type: 'Stack',
			props: { direction: 'horizontal', justify: 'center', py: 16 },
			children: ['cta-btn'],
		},
		'cta-btn': {
			type: 'Button',
			props: { label: 'Start Building', variant: 'secondary', size: 'lg' },
		},
	},
};

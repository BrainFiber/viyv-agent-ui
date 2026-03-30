import type { PageSpec } from '@viyv/agent-ui-schema';

export const chatDemoSpec: PageSpec = {
	id: 'chat-demo',
	title: 'Chat Demo',
	description: 'viyv-claw エージェントとのチャットインターフェース',
	root: 'root',
	state: {},
	hooks: {},
	actions: {},
	meta: { tags: ['demo', 'chat', 'agent', 'sse'] },
	elements: {
		root: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 0 },
			children: ['hero', 'chatSection'],
		},

		// ── Hero ──
		hero: {
			type: 'Section',
			props: {
				variant: 'hero',
				bgGradient: { from: '#0f172a', to: '#1e293b', via: '#1e1b4b', direction: 'to-br' },
				minHeight: 'quarter',
				align: 'center',
				justify: 'center',
				maxWidth: 'lg',
				px: 24,
			},
			children: ['heroOverline', 'heroTitle', 'heroSubtitle'],
		},
		heroOverline: {
			type: 'Text',
			props: {
				content: 'AGENT CHAT',
				variant: 'overline',
				color: 'primary',
				align: 'center',
			},
		},
		heroTitle: {
			type: 'Text',
			props: {
				content: 'AI Agent Chat',
				variant: 'display',
				size: 'lg',
				align: 'center',
				textGradient: { from: '#60a5fa', to: '#a78bfa' },
			},
		},
		heroSubtitle: {
			type: 'Text',
			props: {
				content: 'viyv-claw Gateway に接続してエージェントとリアルタイム対話',
				variant: 'body',
				size: 'lg',
				align: 'center',
				color: 'muted',
			},
		},

		// ── Chat ──
		chatSection: {
			type: 'Section',
			props: {
				variant: 'content',
				maxWidth: 'lg',
				py: 32,
				px: 24,
			},
			children: ['chat'],
		},
		chat: {
			type: 'Chat',
			props: {
				endpoint: 'http://localhost:8080',
				agent: 'coder',
				title: 'AI Assistant',
				placeholder: 'Send a message...',
				height: 600,
				showTokenUsage: true,
				welcomeMessage: 'Hello! How can I help you today?',
			},
		},
	},
};

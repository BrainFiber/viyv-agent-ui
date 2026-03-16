import type { PageSpec } from '@viyv/agent-ui-schema';

export const simpleProfileSpec: PageSpec = {
	id: 'simple-profile',
	title: 'ユーザープロフィール',
	description: 'useState のネスト参照 ($hook.user.name 等) を使ったシンプルなプロフィール表示。',
	hooks: {
		user: {
			use: 'useState',
			params: {
				initial: {
					name: '田中 太郎',
					email: 'tanaka@example.com',
					role: 'シニアエンジニア',
					department: '開発部',
					location: '東京オフィス',
					joinDate: '2022-04-01',
					bio: 'フルスタックエンジニアとして5年の経験を持つ。React と TypeScript を得意とし、最近はAIエージェント基盤の開発に注力している。チーム内ではコードレビューとアーキテクチャ設計を担当。',
				},
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'infoCard', 'bioCard'],
		},
		header: {
			type: 'Header',
			props: {
				title: '$hook.user.name',
				subtitle: '$hook.user.role',
			},
		},
		infoCard: {
			type: 'Card',
			props: { title: '基本情報' },
			children: ['infoGrid'],
		},
		infoGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 4 },
			children: ['emailField', 'deptField', 'locationField', 'joinDateField'],
		},
		emailField: {
			type: 'Stat',
			props: { label: 'メール', value: '$hook.user.email' },
		},
		deptField: {
			type: 'Stat',
			props: { label: '部署', value: '$hook.user.department' },
		},
		locationField: {
			type: 'Stat',
			props: { label: '勤務地', value: '$hook.user.location' },
		},
		joinDateField: {
			type: 'Stat',
			props: { label: '入社日', value: '$hook.user.joinDate' },
		},
		bioCard: {
			type: 'Card',
			props: { title: '自己紹介' },
			children: ['bioText'],
		},
		bioText: {
			type: 'Text',
			props: { content: '$hook.user.bio' },
		},
	},
	state: {},
	actions: {},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'profile'],
	},
};

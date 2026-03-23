import type { PageSpec } from '@viyv/agent-ui-schema';

export const settingsPanelSpec: PageSpec = {
	id: 'settings-panel',
	title: '設定パネル',
	description: 'サイドバー + メニューナビゲーションの設定画面',
	hooks: {},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 0 },
			children: ['layoutGrid', 'helpDrawer', 'toastContainer', 'toast'],
		},

		// Main Layout
		layoutGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 0 },
			children: ['sidebar', 'mainContent'],
		},

		// Sidebar
		sidebar: {
			type: 'Sidebar',
			props: { width: 240, collapsed: '$state.sidebarCollapsed' },
			children: ['sidebarMenu'],
		},
		sidebarMenu: {
			type: 'Menu',
			props: {
				items: [
					{ label: '一般', active: true },
					{ label: '外観' },
					{ label: '通知' },
					{ label: 'セキュリティ' },
					{ label: '連携' },
				],
			},
		},

		// Main Content
		mainContent: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['settingsHeader', 'generalCard', 'appearanceCard', 'notificationsCard', 'securityCard'],
		},
		settingsHeader: {
			type: 'Header',
			props: { title: '設定', subtitle: 'アカウントとアプリケーションの設定を管理します' },
		},

		// General Settings
		generalCard: {
			type: 'Card',
			props: { title: '一般設定' },
			children: ['generalStack'],
		},
		generalStack: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['displayNameInput', 'emailInput', 'languageSelect', 'generalSaveButton'],
		},
		displayNameInput: {
			type: 'Input',
			props: { label: '表示名', placeholder: '表示名を入力', value: '$bindState.displayName' },
		},
		emailInput: {
			type: 'Input',
			props: { label: 'メール', placeholder: 'email@example.com', type: 'email', value: '$bindState.email' },
		},
		languageSelect: {
			type: 'Select',
			props: {
				label: '言語',
				options: [
					{ value: 'ja', label: '日本語' },
					{ value: 'en', label: 'English' },
					{ value: 'zh', label: '中文' },
					{ value: 'ko', label: '한국어' },
				],
				value: '$bindState.language',
			},
		},
		generalSaveButton: {
			type: 'Button',
			props: { label: '保存', variant: 'primary', onClick: '$action.saveGeneral' },
		},

		// Appearance Settings
		appearanceCard: {
			type: 'Card',
			props: { title: '外観' },
			children: ['appearanceTabs'],
		},
		appearanceTabs: {
			type: 'Tabs',
			props: {
				tabs: [
					{ id: 'theme', label: 'テーマ' },
					{ id: 'layout', label: 'レイアウト' },
				],
			},
			children: ['themeContent', 'layoutContent'],
		},
		themeContent: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['darkModeSwitch', 'fontSizeSlider'],
		},
		darkModeSwitch: {
			type: 'Switch',
			props: { label: 'ダークモード', checked: '$bindState.darkMode' },
		},
		fontSizeSlider: {
			type: 'Slider',
			props: { label: 'フォントサイズ', min: 12, max: 24, step: 1, value: '$bindState.fontSize' },
		},
		layoutContent: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['compactModeSwitch', 'sidebarWidthSlider'],
		},
		compactModeSwitch: {
			type: 'Switch',
			props: { label: 'コンパクトモード', checked: '$bindState.compactMode' },
		},
		sidebarWidthSlider: {
			type: 'Slider',
			props: { label: 'サイドバー幅', min: 180, max: 400, step: 10, value: '$bindState.sidebarWidth' },
		},

		// Notifications
		notificationsCard: {
			type: 'Card',
			props: { title: '通知' },
			children: ['notificationsAccordion'],
		},
		notificationsAccordion: {
			type: 'Accordion',
			props: {
				panels: [
					{ id: 'email-notif', title: 'メール通知' },
					{ id: 'push-notif', title: 'プッシュ通知' },
					{ id: 'slack-notif', title: 'Slack通知' },
				],
				defaultOpen: ['email-notif'],
			},
			children: ['emailNotifContent', 'pushNotifContent', 'slackNotifContent'],
		},
		emailNotifContent: {
			type: 'Stack',
			props: { gap: 3 },
			children: ['emailNewUserSwitch', 'emailReportSwitch', 'emailAlertSwitch'],
		},
		emailNewUserSwitch: {
			type: 'Switch',
			props: { label: '新規ユーザー登録通知', checked: '$bindState.emailNewUser' },
		},
		emailReportSwitch: {
			type: 'Switch',
			props: { label: '週次レポート', checked: '$bindState.emailReport' },
		},
		emailAlertSwitch: {
			type: 'Switch',
			props: { label: 'システムアラート', checked: '$bindState.emailAlert' },
		},
		pushNotifContent: {
			type: 'Stack',
			props: { gap: 3 },
			children: ['pushMessageSwitch', 'pushUpdateSwitch'],
		},
		pushMessageSwitch: {
			type: 'Switch',
			props: { label: 'メッセージ通知', checked: '$bindState.pushMessage' },
		},
		pushUpdateSwitch: {
			type: 'Switch',
			props: { label: 'アップデート通知', checked: '$bindState.pushUpdate' },
		},
		slackNotifContent: {
			type: 'Stack',
			props: { gap: 3 },
			children: ['slackDeploySwitch', 'slackErrorSwitch'],
		},
		slackDeploySwitch: {
			type: 'Switch',
			props: { label: 'デプロイ通知', checked: '$bindState.slackDeploy' },
		},
		slackErrorSwitch: {
			type: 'Switch',
			props: { label: 'エラー通知', checked: '$bindState.slackError' },
		},

		// Security
		securityCard: {
			type: 'Card',
			props: { title: 'セキュリティ' },
			children: ['securityStack'],
		},
		securityStack: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['twoFactorSwitch', 'twoFactorAlert'],
		},
		twoFactorSwitch: {
			type: 'Switch',
			props: { label: '2要素認証', checked: '$bindState.twoFactor' },
		},
		twoFactorAlert: {
			type: 'Alert',
			props: {
				title: '推奨',
				message: 'アカウントのセキュリティを強化するため、2要素認証の有効化を推奨します。',
				variant: 'info',
			},
		},

		// Help Drawer
		helpDrawer: {
			type: 'Drawer',
			props: { title: 'ヘルプ', position: 'right', width: 400 },
			visible: { expr: '$state.showHelp' },
			children: ['helpContent'],
		},
		helpContent: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['helpText1', 'helpDivider', 'helpText2'],
		},
		helpText1: {
			type: 'Text',
			props: { content: '設定画面では、アカウント情報の編集、外観のカスタマイズ、通知設定の管理ができます。' },
		},
		helpDivider: {
			type: 'Divider',
			props: {},
		},
		helpText2: {
			type: 'Text',
			props: { content: 'ご不明な点がございましたら、サポートチームまでお問い合わせください。' },
		},

		// Toast
		toastContainer: {
			type: 'ToastContainer',
			props: {},
		},
		toast: {
			type: 'Toast',
			props: { message: '設定を保存しました', type: 'success' },
			visible: { expr: '$state.showToast' },
		},
	},
	state: {
		sidebarCollapsed: false,
		displayName: '山田 太郎',
		email: 'yamada@example.com',
		language: 'ja',
		darkMode: false,
		fontSize: 16,
		compactMode: false,
		sidebarWidth: 240,
		emailNewUser: true,
		emailReport: true,
		emailAlert: true,
		pushMessage: true,
		pushUpdate: false,
		slackDeploy: true,
		slackError: true,
		twoFactor: false,
		showHelp: false,
		showToast: false,
	},
	actions: {
		saveGeneral: { type: 'setState', key: 'showToast', value: true },
		toggleHelp: { type: 'setState', key: 'showHelp', value: true },
		closeHelp: { type: 'setState', key: 'showHelp', value: false },
	},
	meta: { tags: ['settings', 'demo'] },
};

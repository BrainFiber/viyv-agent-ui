import type { PageSpec } from '@viyv/agent-ui-schema';

export const settingsPageSpec: PageSpec = {
	id: 'settings-page',
	title: 'アプリケーション設定',
	description: 'Switch, Slider, Collapse, Toast コンポーネントのデモ',
	hooks: {},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'settingsCollapse', 'saveButton', 'savedToast'],
		},
		header: {
			type: 'Header',
			props: {
				title: 'アプリケーション設定',
				subtitle: '各種設定を変更できます',
			},
		},

		// --- Collapse ---
		settingsCollapse: {
			type: 'Collapse',
			props: {
				panels: [
					{ id: 'notif', title: '通知設定' },
					{ id: 'display', title: '表示設定' },
					{ id: 'security', title: 'セキュリティ設定' },
				],
				defaultOpen: ['notif'],
			},
			children: ['notifContent', 'displayContent', 'securityContent'],
		},

		// --- 通知設定 ---
		notifContent: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['emailSwitch', 'pushSwitch', 'slackSwitch'],
		},
		emailSwitch: {
			type: 'Switch',
			props: {
				label: 'メール通知',
				checked: '$bindState.emailNotif',
				onChange: '$action.setEmailNotif',
			},
		},
		pushSwitch: {
			type: 'Switch',
			props: {
				label: 'プッシュ通知',
				checked: '$bindState.pushNotif',
				onChange: '$action.setPushNotif',
			},
		},
		slackSwitch: {
			type: 'Switch',
			props: {
				label: 'Slack 通知',
				checked: '$bindState.slackNotif',
				onChange: '$action.setSlackNotif',
			},
		},

		// --- 表示設定 ---
		displayContent: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['fontSizeSlider', 'darkModeSwitch', 'sidebarWidthSlider'],
		},
		fontSizeSlider: {
			type: 'Slider',
			props: {
				label: 'フォントサイズ',
				min: 12,
				max: 24,
				step: 1,
				value: '$bindState.fontSize',
				showValue: true,
				onChange: '$action.setFontSize',
			},
		},
		darkModeSwitch: {
			type: 'Switch',
			props: {
				label: 'ダークモード',
				checked: '$bindState.darkMode',
				onChange: '$action.setDarkMode',
			},
		},
		sidebarWidthSlider: {
			type: 'Slider',
			props: {
				label: 'サイドバー幅',
				min: 200,
				max: 400,
				step: 10,
				value: '$bindState.sidebarWidth',
				showValue: true,
				onChange: '$action.setSidebarWidth',
			},
		},

		// --- セキュリティ設定 ---
		securityContent: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['twoFactorSwitch', 'autoLogoutSwitch'],
		},
		twoFactorSwitch: {
			type: 'Switch',
			props: {
				label: '二要素認証 (2FA)',
				checked: '$bindState.twoFactor',
				onChange: '$action.setTwoFactor',
			},
		},
		autoLogoutSwitch: {
			type: 'Switch',
			props: {
				label: '自動ログアウト',
				checked: '$bindState.autoLogout',
				onChange: '$action.setAutoLogout',
			},
		},

		// --- 保存ボタン ---
		saveButton: {
			type: 'Button',
			props: {
				label: '設定を保存',
				variant: 'primary',
				onClick: '$action.saveSettings',
			},
		},

		// --- Toast ---
		savedToast: {
			type: 'Toast',
			props: {
				message: '保存しました',
				type: 'success',
				duration: 3000,
				position: 'top-right',
				closable: true,
			},
			visible: { expr: '$state.showToast' },
		},
	},
	state: {
		// 通知設定
		emailNotif: true,
		pushNotif: false,
		slackNotif: false,
		// 表示設定
		fontSize: 16,
		darkMode: false,
		sidebarWidth: 260,
		// セキュリティ設定
		twoFactor: false,
		autoLogout: true,
		// Toast 表示
		showToast: false,
	},
	actions: {
		// 通知設定
		setEmailNotif: { type: 'setState', key: 'emailNotif' },
		setPushNotif: { type: 'setState', key: 'pushNotif' },
		setSlackNotif: { type: 'setState', key: 'slackNotif' },
		// 表示設定
		setFontSize: { type: 'setState', key: 'fontSize' },
		setDarkMode: { type: 'setState', key: 'darkMode' },
		setSidebarWidth: { type: 'setState', key: 'sidebarWidth' },
		// セキュリティ設定
		setTwoFactor: { type: 'setState', key: 'twoFactor' },
		setAutoLogout: { type: 'setState', key: 'autoLogout' },
		// 保存
		saveSettings: { type: 'setState', key: 'showToast', value: true },
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'settings'],
	},
};

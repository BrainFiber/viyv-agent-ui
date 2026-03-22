import type { PageSpec } from '@viyv/agent-ui-schema';

export const onboardingWizardSpec: PageSpec = {
	id: 'onboarding-wizard',
	title: 'セットアップウィザード',
	description: 'Stepper, Skeleton, Spinner, Drawer コンポーネントのデモ',
	hooks: {},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: [
				'header',
				'stepper',
				'step1Content',
				'step2Content',
				'step3Content',
				'step4Content',
				'loadingCard',
				'skeletonCard',
				'navStep0',
				'navStep1',
				'navStep2',
				'navStep3',
				'helpDrawer',
			],
		},
		header: {
			type: 'Header',
			props: {
				title: 'セットアップウィザード',
				subtitle: '4つのステップでセットアップを完了しましょう',
			},
		},

		// --- Stepper ---
		stepper: {
			type: 'Stepper',
			props: {
				steps: [
					{ label: 'プロフィール設定', description: '基本情報を入力' },
					{ label: 'チーム作成', description: 'チームを構成' },
					{ label: '通知設定', description: '通知方法を選択' },
					{ label: '完了', description: 'セットアップ完了' },
				],
				current: '$state.currentStep',
				direction: 'horizontal',
			},
		},

		// --- Step 1: プロフィール設定 ---
		step1Content: {
			type: 'Card',
			props: { title: 'プロフィール設定' },
			children: ['step1Form'],
			visible: { expr: '$expr(state.currentStep === 0)' },
		},
		step1Form: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['profileNameInput', 'profileEmailInput', 'profileRoleSelect'],
		},
		profileNameInput: {
			type: 'TextInput',
			props: {
				label: '表示名',
				placeholder: '山田 太郎',
				value: '$bindState.profileName',
				onChange: '$action.setProfileName',
			},
		},
		profileEmailInput: {
			type: 'TextInput',
			props: {
				label: 'メールアドレス',
				placeholder: 'taro@example.com',
				value: '$bindState.profileEmail',
				onChange: '$action.setProfileEmail',
			},
		},
		profileRoleSelect: {
			type: 'Select',
			props: {
				label: '役職',
				placeholder: '選択してください',
				options: [
					{ value: 'engineer', label: 'エンジニア' },
					{ value: 'designer', label: 'デザイナー' },
					{ value: 'pm', label: 'プロダクトマネージャー' },
					{ value: 'other', label: 'その他' },
				],
				value: '$bindState.profileRole',
				onChange: '$action.setProfileRole',
			},
		},

		// --- Step 2: チーム作成 ---
		step2Content: {
			type: 'Card',
			props: { title: 'チーム作成' },
			children: ['step2Form'],
			visible: { expr: '$expr(state.currentStep === 1)' },
		},
		step2Form: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['teamNameInput', 'teamSizeSelect', 'teamDescTextarea'],
		},
		teamNameInput: {
			type: 'TextInput',
			props: {
				label: 'チーム名',
				placeholder: '開発チーム A',
				value: '$bindState.teamName',
				onChange: '$action.setTeamName',
			},
		},
		teamSizeSelect: {
			type: 'Select',
			props: {
				label: 'チーム規模',
				placeholder: '選択してください',
				options: [
					{ value: 'small', label: '1〜5名' },
					{ value: 'medium', label: '6〜15名' },
					{ value: 'large', label: '16〜50名' },
					{ value: 'enterprise', label: '50名以上' },
				],
				value: '$bindState.teamSize',
				onChange: '$action.setTeamSize',
			},
		},
		teamDescTextarea: {
			type: 'Textarea',
			props: {
				label: 'チームの説明',
				placeholder: 'チームの目的や役割を入力してください',
				rows: 3,
				value: '$bindState.teamDesc',
				onChange: '$action.setTeamDesc',
			},
		},

		// --- Step 3: 通知設定 ---
		step3Content: {
			type: 'Card',
			props: { title: '通知設定' },
			children: ['step3Form'],
			visible: { expr: '$expr(state.currentStep === 2)' },
		},
		step3Form: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['emailNotifSwitch', 'slackNotifSwitch', 'digestRadio'],
		},
		emailNotifSwitch: {
			type: 'Switch',
			props: {
				label: 'メール通知を受け取る',
				checked: '$bindState.emailNotif',
				onChange: '$action.setEmailNotif',
			},
		},
		slackNotifSwitch: {
			type: 'Switch',
			props: {
				label: 'Slack 通知を受け取る',
				checked: '$bindState.slackNotif',
				onChange: '$action.setSlackNotif',
			},
		},
		digestRadio: {
			type: 'RadioGroup',
			props: {
				label: '通知頻度',
				options: [
					{ value: 'realtime', label: 'リアルタイム' },
					{ value: 'hourly', label: '1時間ごと' },
					{ value: 'daily', label: '1日1回（まとめ）' },
				],
				value: '$bindState.digestFrequency',
				onChange: '$action.setDigestFrequency',
			},
		},

		// --- Step 4: 完了 ---
		step4Content: {
			type: 'Card',
			props: { title: 'セットアップ完了' },
			children: ['step4Stack'],
			visible: { expr: '$expr(state.currentStep === 3)' },
		},
		step4Stack: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['completionText', 'completionAlert'],
		},
		completionText: {
			type: 'Text',
			props: {
				content:
					'すべてのセットアップが完了しました。ダッシュボードに移動して、プロジェクトを開始しましょう。',
			},
		},
		completionAlert: {
			type: 'Alert',
			props: {
				type: 'success',
				title: 'セットアップ完了',
				message: 'ワークスペースの準備が整いました。いつでも設定を変更できます。',
			},
		},

		// --- Spinner demo ---
		loadingCard: {
			type: 'Card',
			props: { title: 'データを読み込み中...' },
			children: ['spinnerWrapper'],
		},
		spinnerWrapper: {
			type: 'Stack',
			props: { gap: 2, align: 'center' },
			children: ['loadingSpinner'],
		},
		loadingSpinner: {
			type: 'Spinner',
			props: {
				size: 'lg',
				label: '設定データを読み込んでいます',
			},
		},

		// --- Skeleton demo ---
		skeletonCard: {
			type: 'Card',
			props: { title: 'コンテンツを準備中...' },
			children: ['skeletonStack'],
		},
		skeletonStack: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['skeletonHeader', 'skeletonBody', 'skeletonAvatarRow'],
		},
		skeletonHeader: {
			type: 'Skeleton',
			props: {
				variant: 'rect',
				height: 32,
				width: '60%',
			},
		},
		skeletonBody: {
			type: 'Skeleton',
			props: {
				variant: 'text',
				lines: 4,
			},
		},
		skeletonAvatarRow: {
			type: 'Grid',
			props: { columns: 4, gap: 4 },
			children: [
				'skeletonCircle1',
				'skeletonCircle2',
				'skeletonCircle3',
				'skeletonCircle4',
			],
		},
		skeletonCircle1: {
			type: 'Skeleton',
			props: { variant: 'circle', width: 48 },
		},
		skeletonCircle2: {
			type: 'Skeleton',
			props: { variant: 'circle', width: 48 },
		},
		skeletonCircle3: {
			type: 'Skeleton',
			props: { variant: 'circle', width: 48 },
		},
		skeletonCircle4: {
			type: 'Skeleton',
			props: { variant: 'circle', width: 48 },
		},

		// --- Navigation buttons (per-step, using fixed values) ---
		navStep0: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4, justify: 'between' },
			children: ['helpButtonStep0', 'nextBtnStep0'],
			visible: { expr: '$expr(state.currentStep === 0)' },
		},
		helpButtonStep0: {
			type: 'Button',
			props: { label: 'ヘルプ', variant: 'secondary', onClick: '$action.openHelp' },
		},
		nextBtnStep0: {
			type: 'Button',
			props: { label: '次のステップ', variant: 'primary', onClick: '$action.goToStep1' },
		},

		navStep1: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4, justify: 'between' },
			children: ['prevBtnStep1', 'helpButtonStep1', 'nextBtnStep1'],
			visible: { expr: '$expr(state.currentStep === 1)' },
		},
		prevBtnStep1: {
			type: 'Button',
			props: { label: '前のステップ', variant: 'secondary', onClick: '$action.goToStep0' },
		},
		helpButtonStep1: {
			type: 'Button',
			props: { label: 'ヘルプ', variant: 'secondary', onClick: '$action.openHelp' },
		},
		nextBtnStep1: {
			type: 'Button',
			props: { label: '次のステップ', variant: 'primary', onClick: '$action.goToStep2' },
		},

		navStep2: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4, justify: 'between' },
			children: ['prevBtnStep2', 'helpButtonStep2', 'nextBtnStep2'],
			visible: { expr: '$expr(state.currentStep === 2)' },
		},
		prevBtnStep2: {
			type: 'Button',
			props: { label: '前のステップ', variant: 'secondary', onClick: '$action.goToStep1' },
		},
		helpButtonStep2: {
			type: 'Button',
			props: { label: 'ヘルプ', variant: 'secondary', onClick: '$action.openHelp' },
		},
		nextBtnStep2: {
			type: 'Button',
			props: { label: '次のステップ', variant: 'primary', onClick: '$action.goToStep3' },
		},

		navStep3: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 4, justify: 'between' },
			children: ['prevBtnStep3', 'helpButtonStep3'],
			visible: { expr: '$expr(state.currentStep === 3)' },
		},
		prevBtnStep3: {
			type: 'Button',
			props: { label: '前のステップ', variant: 'secondary', onClick: '$action.goToStep2' },
		},
		helpButtonStep3: {
			type: 'Button',
			props: { label: 'ヘルプ', variant: 'secondary', onClick: '$action.openHelp' },
		},

		// --- Drawer (Help) ---
		helpDrawer: {
			type: 'Drawer',
			props: {
				title: 'ヘルプ',
				position: 'right',
				width: 480,
				onClose: '$action.closeHelp',
			},
			children: ['helpContent'],
			visible: { expr: '$state.showHelp' },
		},
		helpContent: {
			type: 'Stack',
			props: { gap: 6 },
			children: [
				'helpIntroText',
				'helpStep1Card',
				'helpStep2Card',
				'helpStep3Card',
				'helpStep4Card',
				'helpCloseButton',
			],
		},
		helpIntroText: {
			type: 'Text',
			props: {
				content:
					'セットアップウィザードの各ステップについて説明します。不明な点がある場合は、サポートチームにお問い合わせください。',
			},
		},
		helpStep1Card: {
			type: 'Card',
			props: { title: 'ステップ1: プロフィール設定' },
			children: ['helpStep1Text'],
		},
		helpStep1Text: {
			type: 'Text',
			props: {
				content:
					'表示名、メールアドレス、役職を設定します。これらの情報はチームメンバーに公開されます。後からいつでも変更可能です。',
			},
		},
		helpStep2Card: {
			type: 'Card',
			props: { title: 'ステップ2: チーム作成' },
			children: ['helpStep2Text'],
		},
		helpStep2Text: {
			type: 'Text',
			props: {
				content:
					'チーム名と規模を設定します。チームを作成すると、メンバーを招待してプロジェクトを共有できるようになります。',
			},
		},
		helpStep3Card: {
			type: 'Card',
			props: { title: 'ステップ3: 通知設定' },
			children: ['helpStep3Text'],
		},
		helpStep3Text: {
			type: 'Text',
			props: {
				content:
					'メールや Slack での通知を設定します。通知頻度はリアルタイム、1時間ごと、1日1回から選べます。',
			},
		},
		helpStep4Card: {
			type: 'Card',
			props: { title: 'ステップ4: 完了' },
			children: ['helpStep4Text'],
		},
		helpStep4Text: {
			type: 'Text',
			props: {
				content:
					'すべての設定が完了すると、ダッシュボードに移動できます。設定はいつでもプロフィール画面から変更できます。',
			},
		},
		helpCloseButton: {
			type: 'Button',
			props: {
				label: '閉じる',
				variant: 'secondary',
				onClick: '$action.closeHelp',
			},
		},
	},
	state: {
		currentStep: 0,
		showHelp: false,
		// Step 1: プロフィール
		profileName: '',
		profileEmail: '',
		profileRole: '',
		// Step 2: チーム
		teamName: '',
		teamSize: '',
		teamDesc: '',
		// Step 3: 通知
		emailNotif: true,
		slackNotif: false,
		digestFrequency: 'realtime',
	},
	actions: {
		// Step navigation (fixed values for reliability)
		goToStep0: { type: 'setState', key: 'currentStep', value: 0 },
		goToStep1: { type: 'setState', key: 'currentStep', value: 1 },
		goToStep2: { type: 'setState', key: 'currentStep', value: 2 },
		goToStep3: { type: 'setState', key: 'currentStep', value: 3 },
		// Help drawer
		openHelp: { type: 'setState', key: 'showHelp', value: true },
		closeHelp: { type: 'setState', key: 'showHelp', value: false },
		// Step 1: プロフィール
		setProfileName: { type: 'setState', key: 'profileName' },
		setProfileEmail: { type: 'setState', key: 'profileEmail' },
		setProfileRole: { type: 'setState', key: 'profileRole' },
		// Step 2: チーム
		setTeamName: { type: 'setState', key: 'teamName' },
		setTeamSize: { type: 'setState', key: 'teamSize' },
		setTeamDesc: { type: 'setState', key: 'teamDesc' },
		// Step 3: 通知
		setEmailNotif: { type: 'setState', key: 'emailNotif' },
		setSlackNotif: { type: 'setState', key: 'slackNotif' },
		setDigestFrequency: { type: 'setState', key: 'digestFrequency' },
	},
	meta: {
		createdBy: 'seed',
		tags: ['demo', 'onboarding'],
	},
};

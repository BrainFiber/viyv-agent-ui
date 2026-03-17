import type { PageSpec } from '@viyv/agent-ui-schema';

export const contactFormSpec: PageSpec = {
	id: 'contact-form',
	title: 'お問い合わせフォーム',
	description: '全入力コンポーネントを使ったお問い合わせフォーム',
	root: 'page',
	elements: {
		page: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 24 },
			children: ['header', 'formCard', 'resultAlert', 'confirmDialog'],
		},
		header: {
			type: 'Header',
			props: { title: 'お問い合わせ', subtitle: 'ご質問・ご要望をお寄せください', level: 1 },
		},
		formCard: {
			type: 'Card',
			props: { title: '入力フォーム' },
			children: ['formStack'],
		},
		formStack: {
			type: 'Stack',
			props: { direction: 'vertical', gap: 16 },
			children: [
				'nameRow',
				'categorySelect',
				'priorityRadio',
				'messageTextarea',
				'agreeCheckbox',
				'submitButton',
			],
		},
		nameRow: {
			type: 'Grid',
			props: { columns: 2, gap: 16 },
			children: ['nameInput', 'emailInput'],
		},
		nameInput: {
			type: 'TextInput',
			props: {
				label: 'お名前',
				placeholder: '山田太郎',
				value: '$bindState.name',
				onChange: '$action.setName',
				error: '$expr(state.name.length > 0 && state.name.trim().length < 2 ? "2文字以上入力してください" : "")',
			},
		},
		emailInput: {
			type: 'TextInput',
			props: {
				label: 'メールアドレス',
				placeholder: 'taro@example.com',
				value: '$bindState.email',
				onChange: '$action.setEmail',
				error: '$expr(state.email.length > 0 && !state.email.includes("@") ? "メールアドレスの形式が正しくありません" : "")',
			},
		},
		categorySelect: {
			type: 'Select',
			props: {
				label: 'カテゴリ',
				placeholder: '選択してください',
				options: [
					{ value: 'general', label: '一般的なお問い合わせ' },
					{ value: 'technical', label: '技術的なサポート' },
					{ value: 'billing', label: '料金・お支払い' },
					{ value: 'other', label: 'その他' },
				],
				value: '$bindState.category',
				onChange: '$action.setCategory',
			},
		},
		priorityRadio: {
			type: 'RadioGroup',
			props: {
				label: '優先度',
				options: [
					{ value: 'low', label: '低' },
					{ value: 'normal', label: '通常' },
					{ value: 'high', label: '高' },
					{ value: 'urgent', label: '緊急' },
				],
				value: '$bindState.priority',
				onChange: '$action.setPriority',
			},
		},
		messageTextarea: {
			type: 'Textarea',
			props: {
				label: 'メッセージ',
				placeholder: 'お問い合わせ内容を入力してください',
				rows: 5,
				value: '$bindState.message',
				onChange: '$action.setMessage',
			},
		},
		agreeCheckbox: {
			type: 'Checkbox',
			props: { label: '利用規約に同意します', checked: '$bindState.agree', onChange: '$action.setAgree' },
		},
		submitButton: {
			type: 'Button',
			props: {
				label: '送信する',
				variant: 'primary',
				onClick: '$action.openDialog',
				disabled: '$expr(state.name.trim().length < 2 || !state.email.includes("@") || state.category.length === 0 || state.message.trim().length === 0 || !state.agree)',
			},
		},
		confirmDialog: {
			type: 'Dialog',
			props: { title: '送信確認' },
			children: ['confirmContent', 'dialogButtons'],
			visible: { expr: 'state.showConfirmDialog' },
		},
		confirmContent: {
			type: 'Text',
			props: { content: '入力内容を送信します。よろしいですか？' },
		},
		dialogButtons: {
			type: 'Stack',
			props: { direction: 'horizontal', gap: 8, justify: 'end' },
			children: ['cancelButton', 'confirmButton'],
		},
		cancelButton: {
			type: 'Button',
			props: { label: 'キャンセル', variant: 'secondary', onClick: '$action.closeDialog' },
		},
		confirmButton: {
			type: 'Button',
			props: { label: '送信する', variant: 'primary', onClick: '$action.submitForm' },
		},
		resultAlert: {
			type: 'Alert',
			props: {
				message: '$expr(state.submitResult?.message ?? "")',
				type: '$expr(state.submitResult?.success ? "success" : "error")',
				title: '$expr(state.submitResult?.success ? "送信完了" : "エラー")',
			},
			visible: { expr: 'state.submitResult != null' },
		},
	},
	hooks: {},
	state: {
		name: '',
		email: '',
		category: '',
		priority: 'normal',
		message: '',
		agree: false,
		submitResult: null,
		showConfirmDialog: false,
	},
	actions: {
		setName: { type: 'setState', key: 'name' },
		setEmail: { type: 'setState', key: 'email' },
		setCategory: { type: 'setState', key: 'category' },
		setPriority: { type: 'setState', key: 'priority' },
		setMessage: { type: 'setState', key: 'message' },
		setAgree: { type: 'setState', key: 'agree' },
		openDialog: { type: 'setState', key: 'showConfirmDialog', value: true },
		closeDialog: { type: 'setState', key: 'showConfirmDialog', value: false },
		submitForm: {
			type: 'submitForm',
			url: '/api/form-submit',
			method: 'POST',
			stateKey: 'submitResult',
			onComplete: { showConfirmDialog: false },
		},
	},
};

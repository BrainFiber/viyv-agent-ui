import type { PageSpec } from '@viyv/agent-ui-schema';

export const formBuilderSpec: PageSpec = {
	id: 'form-builder',
	title: 'フォームビルダー',
	description: '全入力コンポーネントを使った総合フォームデモ',
	hooks: {},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'stepper', 'basicInfoCard', 'orderDetailsCard', 'confirmCard', 'successDialog', 'toastContainer', 'toast'],
		},
		header: {
			type: 'Header',
			props: { title: '注文フォーム', subtitle: '商品の注文情報を入力してください' },
		},

		// Stepper
		stepper: {
			type: 'Stepper',
			props: {
				steps: [
					{ label: '基本情報', description: 'お客様情報' },
					{ label: '注文詳細', description: '商品と配送' },
					{ label: '確認', description: '内容確認' },
				],
				current: '$state.currentStep',
			},
		},

		// Card 1: 基本情報
		basicInfoCard: {
			type: 'Card',
			props: { title: '基本情報' },
			children: ['basicInfoForm'],
		},
		basicInfoForm: {
			type: 'Form',
			props: {},
			children: ['nameField', 'emailField', 'dateTimeGrid', 'otpField'],
		},
		nameField: {
			type: 'Field',
			props: { label: '名前', required: true },
			children: ['nameInput'],
		},
		nameInput: {
			type: 'Input',
			props: { placeholder: 'お名前を入力', value: '$bindState.customerName' },
		},
		emailField: {
			type: 'Field',
			props: { label: 'メール', required: true },
			children: ['emailInputGroup'],
		},
		emailInputGroup: {
			type: 'InputGroup',
			props: { prefix: '@' },
			children: ['emailInput'],
		},
		emailInput: {
			type: 'Input',
			props: { placeholder: 'email@example.com', type: 'email', value: '$bindState.customerEmail' },
		},
		dateTimeGrid: {
			type: 'Grid',
			props: { columns: 2, gap: 4 },
			children: ['deliveryDateField', 'timeSlotField'],
		},
		deliveryDateField: {
			type: 'Field',
			props: { label: '配送日' },
			children: ['deliveryDatePicker'],
		},
		deliveryDatePicker: {
			type: 'DatePicker',
			props: { label: '配送日', value: '$bindState.deliveryDate' },
		},
		timeSlotField: {
			type: 'Field',
			props: { label: '時間帯' },
			children: ['timeSlotSelect'],
		},
		timeSlotSelect: {
			type: 'NativeSelect',
			props: {
				label: '時間帯',
				options: [
					{ value: 'morning', label: '午前' },
					{ value: 'afternoon', label: '午後' },
					{ value: 'evening', label: '夜間' },
				],
				value: '$bindState.timeSlot',
			},
		},
		otpField: {
			type: 'Field',
			props: { label: '確認コード' },
			children: ['otpInput'],
		},
		otpInput: {
			type: 'InputOTP',
			props: { length: 6, value: '$bindState.confirmCode' },
		},

		// Card 2: 注文詳細
		orderDetailsCard: {
			type: 'Card',
			props: { title: '注文詳細' },
			children: ['orderDetailsStack'],
		},
		orderDetailsStack: {
			type: 'Stack',
			props: { gap: 4 },
			children: [
				'productCombobox',
				'quantitySlider',
				'sizeRadio',
				'optionToggles',
				'memoToggle',
				'memoTextarea',
				'termsCheckbox',
				'newsletterSwitch',
				'paymentSelect',
				'ratingField',
			],
		},
		productCombobox: {
			type: 'Combobox',
			props: {
				label: '商品検索',
				options: [
					{ value: 'widget-a', label: 'ウィジェットA' },
					{ value: 'gadget-b', label: 'ガジェットB' },
					{ value: 'connector-c', label: 'コネクタC' },
					{ value: 'module-d', label: 'モジュールD' },
					{ value: 'sensor-e', label: 'センサーE' },
				],
				placeholder: '商品を検索...',
				value: '$bindState.selectedProduct',
			},
		},
		quantitySlider: {
			type: 'Slider',
			props: { label: '数量', min: 1, max: 10, step: 1, value: '$bindState.quantity' },
		},
		sizeRadio: {
			type: 'RadioGroup',
			props: {
				label: 'サイズ',
				options: [
					{ value: 'S', label: 'S' },
					{ value: 'M', label: 'M' },
					{ value: 'L', label: 'L' },
					{ value: 'XL', label: 'XL' },
				],
				value: '$bindState.size',
			},
		},
		optionToggles: {
			type: 'ToggleGroup',
			props: {
				items: [
					{ value: 'gift', label: 'ギフト包装' },
					{ value: 'express', label: '速達' },
					{ value: 'insurance', label: '保険' },
				],
				value: '$bindState.options',
			},
		},
		memoToggle: {
			type: 'Toggle',
			props: { label: 'メモを追加', pressed: '$bindState.showMemo' },
		},
		memoTextarea: {
			type: 'Textarea',
			props: { label: 'メモ', placeholder: '備考を入力してください', value: '$bindState.memo' },
			visible: { expr: '$state.showMemo' },
		},
		termsCheckbox: {
			type: 'Checkbox',
			props: { label: '利用規約に同意する', checked: '$bindState.agreeTerms' },
		},
		newsletterSwitch: {
			type: 'Switch',
			props: { label: 'ニュースレター購読', checked: '$bindState.newsletter' },
		},
		paymentSelect: {
			type: 'Select',
			props: {
				label: '支払方法',
				options: [
					{ value: 'credit', label: 'クレジットカード' },
					{ value: 'bank', label: '銀行振込' },
					{ value: 'cod', label: '代引き' },
				],
				value: '$bindState.paymentMethod',
			},
		},
		ratingField: {
			type: 'Rating',
			props: { label: '満足度', value: '$bindState.satisfaction', max: 5 },
		},

		// Card 3: 確認
		confirmCard: {
			type: 'Card',
			props: { title: '確認' },
			children: ['confirmStack'],
		},
		confirmStack: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['confirmAlert', 'confirmSummary', 'confirmDivider', 'confirmButtons'],
		},
		confirmAlert: {
			type: 'Alert',
			props: { title: '確認', message: '入力内容をご確認ください。送信後の変更はできません。', variant: 'info' },
		},
		confirmSummary: {
			type: 'Text',
			props: { content: 'ご注文内容を確認のうえ、「注文確定」ボタンを押してください。' },
		},
		confirmDivider: {
			type: 'Divider',
			props: {},
		},
		confirmButtons: {
			type: 'ButtonGroup',
			props: {},
			children: ['backButton', 'submitButton'],
		},
		backButton: {
			type: 'Button',
			props: { label: '戻る', variant: 'outline', onClick: '$action.prevStep' },
		},
		submitButton: {
			type: 'Tooltip',
			props: { content: '全ての必須項目を入力してください' },
			children: ['submitButtonInner'],
		},
		submitButtonInner: {
			type: 'Button',
			props: { label: '注文確定', variant: 'primary', onClick: '$action.submitOrder' },
		},

		// Success Dialog
		successDialog: {
			type: 'Dialog',
			props: { title: '注文完了' },
			visible: { expr: '$state.showSuccess' },
			children: ['successContent'],
		},
		successContent: {
			type: 'Stack',
			props: { gap: 3 },
			children: ['successText', 'successCloseButton'],
		},
		successText: {
			type: 'Text',
			props: { content: 'ご注文ありがとうございます。確認メールをお送りしました。' },
		},
		successCloseButton: {
			type: 'Button',
			props: { label: '閉じる', variant: 'primary', onClick: '$action.closeSuccess' },
		},

		// Toast
		toastContainer: {
			type: 'ToastContainer',
			props: {},
		},
		toast: {
			type: 'Toast',
			props: { message: '注文が送信されました', type: 'success' },
			visible: { expr: '$state.showToast' },
		},
	},
	state: {
		currentStep: 0,
		customerName: '',
		customerEmail: '',
		deliveryDate: '',
		timeSlot: 'morning',
		confirmCode: '',
		selectedProduct: '',
		quantity: 1,
		size: 'M',
		options: [],
		showMemo: false,
		memo: '',
		agreeTerms: false,
		newsletter: false,
		paymentMethod: 'credit',
		satisfaction: 0,
		showSuccess: false,
		showToast: false,
	},
	actions: {
		prevStep: { type: 'setState', key: 'currentStep', value: 0 },
		submitOrder: { type: 'setState', key: 'showSuccess', value: true },
		closeSuccess: { type: 'setState', key: 'showSuccess', value: false },
	},
	meta: { tags: ['form', 'demo'] },
};

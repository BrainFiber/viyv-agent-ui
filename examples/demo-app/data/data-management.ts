import type { PageSpec } from '@viyv/agent-ui-schema';

export const dataManagementSpec: PageSpec = {
	id: 'data-management',
	title: 'データ管理',
	description: 'CRUD操作、ページネーション、確認ダイアログを備えたデータ管理画面',
	hooks: {
		users: {
			use: 'useState',
			params: {
				initial: [
					{ id: 'U001', name: '山田 太郎', email: 'yamada@example.com', role: '管理者', status: 'アクティブ' },
					{ id: 'U002', name: '鈴木 花子', email: 'suzuki@example.com', role: '編集者', status: 'アクティブ' },
					{ id: 'U003', name: '佐藤 健一', email: 'sato@example.com', role: '閲覧者', status: '非アクティブ' },
					{ id: 'U004', name: '田中 美咲', email: 'tanaka@example.com', role: '編集者', status: 'アクティブ' },
					{ id: 'U005', name: '高橋 直人', email: 'takahashi@example.com', role: '管理者', status: 'アクティブ' },
					{ id: 'U006', name: '伊藤 裕子', email: 'ito@example.com', role: '閲覧者', status: 'アクティブ' },
					{ id: 'U007', name: '渡辺 大輔', email: 'watanabe@example.com', role: '編集者', status: '保留中' },
					{ id: 'U008', name: '中村 真理', email: 'nakamura@example.com', role: '閲覧者', status: 'アクティブ' },
					{ id: 'U009', name: '小林 誠', email: 'kobayashi@example.com', role: '編集者', status: 'アクティブ' },
					{ id: 'U010', name: '加藤 恵', email: 'kato@example.com', role: '閲覧者', status: '非アクティブ' },
					{ id: 'U011', name: '吉田 浩二', email: 'yoshida@example.com', role: '管理者', status: 'アクティブ' },
					{ id: 'U012', name: '松本 さくら', email: 'matsumoto@example.com', role: '編集者', status: 'アクティブ' },
				],
			},
		},
	},
	root: 'root',
	elements: {
		root: {
			type: 'Stack',
			props: { gap: 6 },
			children: ['header', 'mainCard', 'addDialog', 'deleteDialog', 'toastContainer', 'toast'],
		},
		header: {
			type: 'Header',
			props: { title: 'ユーザー管理', subtitle: 'ユーザーの追加・編集・削除を行います' },
		},

		// Main Card
		mainCard: {
			type: 'Card',
			props: {},
			children: ['cardStack'],
		},
		cardStack: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['toolbar', 'userTable'],
		},

		// Toolbar
		toolbar: {
			type: 'Stack',
			props: { gap: 3, direction: 'horizontal' },
			children: ['roleFilter', 'toolbarActions'],
		},
		roleFilter: {
			type: 'Select',
			props: {
				label: 'ロールフィルター',
				options: [
					{ value: 'all', label: '全て' },
					{ value: '管理者', label: '管理者' },
					{ value: '編集者', label: '編集者' },
					{ value: '閲覧者', label: '閲覧者' },
				],
				placeholder: 'ロールを選択',
				value: '$state.roleFilter',
				onChange: '$action.setRoleFilter',
			},
		},
		toolbarActions: {
			type: 'ButtonGroup',
			props: {},
			children: ['addButton', 'exportButton'],
		},
		addButton: {
			type: 'Button',
			props: { label: '追加', variant: 'primary', onClick: '$action.openAddDialog' },
		},
		exportButton: {
			type: 'Button',
			props: { label: 'エクスポート', variant: 'outline' },
		},

		// Data Table
		userTable: {
			type: 'DataTable',
			props: {
				data: '$hook.users',
				keyField: 'id',
				pageSize: 5,
				columns: [
					{ key: 'name', label: '名前', sortable: true, filter: { type: 'text', placeholder: '名前で検索...' } },
					{ key: 'email', label: 'メール', sortable: true },
					{
						key: 'role',
						label: 'ロール',
						format: 'badge',
						badgeMap: {
							'管理者': 'red',
							'編集者': 'blue',
							'閲覧者': 'gray',
						},
						filter: { type: 'select', placeholder: '全て' },
					},
					{
						key: 'status',
						label: 'ステータス',
						format: 'badge',
						badgeMap: {
							'アクティブ': 'green',
							'保留中': 'yellow',
							'非アクティブ': 'red',
						},
					},
				],
			},
		},

		// Add User Dialog
		addDialog: {
			type: 'Dialog',
			props: { title: 'ユーザー追加', open: '$state.showAddDialog' },
			visible: { expr: '$state.showAddDialog' },
			children: ['addDialogForm'],
		},
		addDialogForm: {
			type: 'Stack',
			props: { gap: 4 },
			children: ['addNameInput', 'addEmailInput', 'addRoleSelect', 'addDialogButtons'],
		},
		addNameInput: {
			type: 'Input',
			props: { label: '名前', placeholder: '名前を入力', value: '$bindState.newUserName' },
		},
		addEmailInput: {
			type: 'Input',
			props: { label: 'メールアドレス', placeholder: 'email@example.com', type: 'email', value: '$bindState.newUserEmail' },
		},
		addRoleSelect: {
			type: 'Select',
			props: {
				label: 'ロール',
				options: [
					{ value: '管理者', label: '管理者' },
					{ value: '編集者', label: '編集者' },
					{ value: '閲覧者', label: '閲覧者' },
				],
				value: '$bindState.newUserRole',
			},
		},
		addDialogButtons: {
			type: 'ButtonGroup',
			props: {},
			children: ['addCancelButton', 'addSubmitButton'],
		},
		addCancelButton: {
			type: 'Button',
			props: { label: 'キャンセル', variant: 'outline', onClick: '$action.closeAddDialog' },
		},
		addSubmitButton: {
			type: 'Button',
			props: { label: '追加', variant: 'primary', onClick: '$action.addUser' },
		},

		// Delete Confirmation Dialog
		deleteDialog: {
			type: 'AlertDialog',
			props: {
				title: '削除確認',
				description: 'このユーザーを削除しますか？この操作は取り消せません。',
				confirmLabel: '削除',
				cancelLabel: 'キャンセル',
				variant: 'destructive',
				open: '$state.showDeleteDialog',
				onConfirm: '$action.confirmDelete',
				onCancel: '$action.closeDeleteDialog',
			},
			visible: { expr: '$state.showDeleteDialog' },
		},

		// Toast
		toastContainer: {
			type: 'ToastContainer',
			props: {},
		},
		toast: {
			type: 'Toast',
			props: { message: '操作が完了しました', type: 'success' },
			visible: { expr: '$state.showToast' },
		},
	},
	state: {
		roleFilter: '',
		showAddDialog: false,
		showDeleteDialog: false,
		showToast: false,
		newUserName: '',
		newUserEmail: '',
		newUserRole: '閲覧者',
		deleteTargetId: '',
	},
	actions: {
		setRoleFilter: { type: 'setState', key: 'roleFilter' },
		openAddDialog: { type: 'setState', key: 'showAddDialog', value: true },
		closeAddDialog: { type: 'setState', key: 'showAddDialog', value: false },
		addUser: { type: 'setState', key: 'showAddDialog', value: false },
		openDeleteDialog: { type: 'setState', key: 'showDeleteDialog', value: true },
		closeDeleteDialog: { type: 'setState', key: 'showDeleteDialog', value: false },
		confirmDelete: { type: 'setState', key: 'showDeleteDialog', value: false },
	},
	meta: { tags: ['data-management', 'crud', 'demo'] },
};

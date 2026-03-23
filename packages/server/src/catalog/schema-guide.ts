import type { ComponentCatalog } from '@viyv/agent-ui-schema';

export interface SchemaGuide {
	pageSpec: Record<string, unknown>;
	hooks: Record<string, unknown>[];
	actions: Record<string, unknown>[];
	expressions: Record<string, unknown>[];
	theme: Record<string, unknown>;
	visibility: Record<string, unknown>;
	navigation: Record<string, unknown>;
	components?: Record<string, unknown>;
}

export function buildSchemaGuide(catalog?: ComponentCatalog): SchemaGuide {
	const hooks = [
		{
			use: 'useState',
			description: 'Client-side state with initial value',
			params: { initial: 'any — initial value' },
			example: { use: 'useState', params: { initial: [] } },
		},
		{
			use: 'useDerived',
			description: 'Computed data from another hook (sort, filter, limit, groupBy, aggregate)',
			params: {
				from: 'string — source hookId',
				sort: '{ key, order: "asc"|"desc" } (optional)',
				filter: '{ key, match: value } (optional)',
				limit: 'number (optional)',
				groupBy: 'string (optional)',
				aggregate: '{ fn: "sum"|"avg"|"count"|"min"|"max", key } (optional)',
			},
			example: { use: 'useDerived', from: 'users', params: { sort: { key: 'name', order: 'asc' }, limit: 10 } },
		},
		{
			use: 'useFetch',
			description: 'HTTP GET/POST request',
			params: {
				url: 'string — URL to fetch',
				method: '"GET"|"POST" (default: GET)',
				headers: 'Record<string, string> (optional)',
				body: 'any (optional, for POST)',
				refreshInterval: 'number in ms (optional)',
			},
			example: { use: 'useFetch', params: { url: 'https://api.example.com/data', method: 'GET' } },
		},
		{
			use: 'useSqlQuery',
			description: 'SQL SELECT query via data source connector. Supports $param.xxx placeholders.',
			params: {
				connection: 'string — data source ID',
				query: 'string — SELECT query (use $param.key for dynamic values)',
				refreshInterval: 'number in ms (optional)',
			},
			example: { use: 'useSqlQuery', params: { connection: 'main-db', query: "SELECT * FROM products WHERE category = $param.category" } },
		},
		{
			use: 'useAgentQuery',
			description: 'Custom endpoint query',
			params: {
				endpoint: 'string — URL endpoint',
				query: 'Record<string, unknown> (optional)',
				refreshInterval: 'number in ms (optional)',
			},
			example: { use: 'useAgentQuery', params: { endpoint: '/api/search', query: { q: 'test' } } },
		},
	];

	const actions = [
		{
			type: 'setState',
			description: 'Update page state value',
			params: { key: 'string — state key', value: 'any (optional — omit to use event value)' },
			example: { type: 'setState', key: 'showDialog', value: true },
		},
		{
			type: 'refreshHook',
			description: 'Re-fetch hook data',
			params: { hookId: 'string' },
			example: { type: 'refreshHook', hookId: 'users' },
		},
		{
			type: 'navigate',
			description: 'Navigate to URL (supports {{stateKey}} interpolation)',
			params: { url: 'string' },
			example: { type: 'navigate', url: '/pages/detail?id={{selectedId}}' },
		},
		{
			type: 'submitForm',
			description: 'POST/PUT/PATCH request with form data from state',
			params: {
				url: 'string',
				method: '"POST"|"PUT"|"PATCH" (default: POST)',
				stateKey: 'string (optional — state key for form data)',
			},
			example: { type: 'submitForm', url: '/api/users', method: 'POST', stateKey: 'formData' },
		},
		{
			type: 'addItem',
			description: 'Add item to useState hook array',
			params: { hookId: 'string', stateKey: 'string — state key for new item data' },
			example: { type: 'addItem', hookId: 'users', stateKey: 'newUser' },
		},
		{
			type: 'removeItem',
			description: 'Remove item from useState hook array',
			params: { hookId: 'string', key: 'string — ID field name', stateKey: 'string — state key holding target ID' },
			example: { type: 'removeItem', hookId: 'users', key: 'id', stateKey: 'deleteTargetId' },
		},
		{
			type: 'updateItem',
			description: 'Update item in useState hook array',
			params: { hookId: 'string', key: 'string — ID field name', stateKey: 'string — state key holding update data' },
			example: { type: 'updateItem', hookId: 'users', key: 'id', stateKey: 'editData' },
		},
	];

	const expressions = [
		{ prefix: '$hook.{hookId}.{path}', description: 'Access hook data with dot-path traversal', example: '$hook.users.0.name' },
		{ prefix: '$state.{key}', description: 'Read page state value (read-only)', example: '$state.selectedTab' },
		{ prefix: '$bindState.{key}', description: 'Two-way state binding (for input components)', example: '$bindState.searchQuery' },
		{ prefix: '$action.{actionId}', description: 'Reference an action handler', example: '$action.handleSubmit' },
		{ prefix: '$item.{path}', description: 'Current item in Repeater/Feed context', example: '$item.title' },
		{ prefix: '$param.{name}', description: 'URL query parameter value (for dynamic pages)', example: '$param.product_key' },
		{ prefix: '$expr({code})', description: 'Inline JavaScript expression (sandbox-evaluated)', example: '$expr(state.count + 1)' },
	];

	const theme = {
		colorScheme: { type: 'enum', values: ['light', 'dark', 'auto'], default: 'auto' },
		accentColor: { type: 'string', description: 'CSS color value to override primary color', optional: true },
		spacing: { type: 'enum', values: ['compact', 'default', 'relaxed'], default: 'default' },
		fontFamily: {
			type: 'object',
			description: 'Custom font families (loaded from Google Fonts)',
			optional: true,
			properties: {
				primary: 'string — e.g. "Inter", "Noto Sans JP"',
				accent: 'string — e.g. "Playfair Display" (for display/hero text)',
			},
		},
		borderRadius: { type: 'enum', values: ['none', 'sm', 'md', 'lg', 'xl'], description: 'Global border radius scale', optional: true },
	};

	const visibility = {
		description: 'Control element visibility with an expression',
		format: '{ expr: "expression" }',
		examples: [
			{ expr: '$state.showDialog' },
			{ expr: '$hook.data.length > 0' },
		],
	};

	const pageSpec = {
		id: 'string (required) — unique page identifier',
		parentId: 'string | null (optional) — parent page ID for tree hierarchy. Set to null to detach from parent.',
		title: 'string (required) — page title',
		description: 'string (optional)',
		hooks: 'Record<hookId, HookDef> — data sources',
		root: 'string (required) — root element ID',
		elements: 'Record<elementId, ElementDef> — component tree',
		state: 'Record<key, initialValue> — page-level state',
		actions: 'Record<actionId, ActionDef> — event handlers',
		params: 'Record<paramName, ParamDef> (optional) — URL query parameter definitions ({ type: "string"|"number", default?, description? })',
		theme: '{ colorScheme?, accentColor?, spacing? } (optional)',
		meta: '{ tags?: string[], createdBy?: string } (optional)',
	};

	const navigation = {
		description: 'Multiple ways to navigate between pages',
		methods: [
			{
				method: 'Link component',
				description: 'Renders a clickable hyperlink',
				example: { type: 'Link', props: { text: '詳細を見る', href: '/pages/detail?id=123' } },
			},
			{
				method: 'navigate action',
				description: 'Programmatic navigation on events (supports {{stateKey}} interpolation)',
				example: { type: 'navigate', url: '/pages/detail?id={{selectedId}}' },
			},
			{
				method: 'DataTable rowHref',
				description: 'Make table rows clickable links (supports {{columnKey}} interpolation)',
				example: {
					type: 'DataTable',
					props: { data: '$hook.items', rowHref: '/pages/detail?id={{id}}', columns: ['...'] },
				},
			},
			{
				method: '$param for dynamic pages',
				description: 'Receive URL query params in a single PageSpec. Define params in PageSpec, use $param.key in hooks/props.',
				example: {
					params: { product_key: { type: 'string', description: '商品キー' } },
					hooks: { product: { use: 'useSqlQuery', params: { connection: 'db', query: "SELECT * FROM products WHERE key = $param.product_key" } } },
				},
			},
		],
	};

	const guide: SchemaGuide = { pageSpec, hooks, actions, expressions, theme, visibility, navigation };

	if (catalog) {
		const categories: Record<string, number> = {};
		for (const meta of Object.values(catalog.components)) {
			categories[meta.category] = (categories[meta.category] ?? 0) + 1;
		}
		guide.components = {
			total: Object.keys(catalog.components).length,
			categories,
			note: 'Use list_components and get_component tools for detailed component info.',
		};
	}

	return guide;
}

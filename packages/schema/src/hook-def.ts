import { z } from 'zod';

export const UseStateHookSchema = z.object({
	use: z.literal('useState'),
	params: z.object({
		initial: z.unknown(),
	}),
});

export const UseDerivedHookSchema = z.object({
	use: z.literal('useDerived'),
	from: z.string().min(1),
	params: z.object({
		sort: z
			.object({
				key: z.string(),
				order: z.enum(['asc', 'desc']).default('asc'),
			})
			.optional(),
		filter: z
			.object({
				key: z.string(),
				match: z.unknown(),
			})
			.optional(),
		limit: z.number().int().positive().optional(),
		groupBy: z.string().optional(),
		aggregate: z
			.object({
				fn: z.enum(['sum', 'avg', 'count', 'min', 'max']),
				key: z.string(),
			})
			.optional(),
	}),
});

export const UseFetchHookSchema = z.object({
	use: z.literal('useFetch'),
	params: z.object({
		url: z.string().url(),
		method: z.enum(['GET', 'POST']).default('GET'),
		headers: z.record(z.string()).optional(),
		body: z.unknown().optional(),
		refreshInterval: z.number().int().positive().optional(),
	}),
});

export const UseSqlQueryHookSchema = z.object({
	use: z.literal('useSqlQuery'),
	params: z.object({
		connection: z.string().min(1),
		query: z.string().min(1),
		refreshInterval: z.number().int().positive().optional(),
	}),
});

export const UseAgentQueryHookSchema = z.object({
	use: z.literal('useAgentQuery'),
	params: z.object({
		endpoint: z.string().min(1),
		query: z.record(z.unknown()).optional(),
		refreshInterval: z.number().int().positive().optional(),
	}),
});

export const HookDefSchema = z.discriminatedUnion('use', [
	UseStateHookSchema,
	UseDerivedHookSchema,
	UseFetchHookSchema,
	UseSqlQueryHookSchema,
	UseAgentQueryHookSchema,
]);

export type HookDef = z.infer<typeof HookDefSchema>;
export type UseStateHook = z.infer<typeof UseStateHookSchema>;
export type UseDerivedHook = z.infer<typeof UseDerivedHookSchema>;
export type UseFetchHook = z.infer<typeof UseFetchHookSchema>;
export type UseSqlQueryHook = z.infer<typeof UseSqlQueryHookSchema>;
export type UseAgentQueryHook = z.infer<typeof UseAgentQueryHookSchema>;

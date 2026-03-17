import { z } from 'zod';

export const SetStateActionSchema = z.object({
	type: z.literal('setState'),
	key: z.string().min(1),
	value: z.unknown().optional(),
});

export const RefreshHookActionSchema = z.object({
	type: z.literal('refreshHook'),
	hookId: z.string().min(1),
});

export const NavigateActionSchema = z.object({
	type: z.literal('navigate'),
	url: z.string().min(1),
});

export const SubmitFormActionSchema = z.object({
	type: z.literal('submitForm'),
	url: z.string().min(1),
	method: z.enum(['POST', 'PUT', 'PATCH']).default('POST'),
	stateKey: z.string().optional(),
	onComplete: z.record(z.unknown()).optional(),
});

export const ActionDefSchema = z.discriminatedUnion('type', [
	SetStateActionSchema,
	RefreshHookActionSchema,
	NavigateActionSchema,
	SubmitFormActionSchema,
]);

export type ActionDef = z.infer<typeof ActionDefSchema>;

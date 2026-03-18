import { z } from 'zod';

export const SetStateActionSchema = z.object({
	type: z.literal('setState'),
	key: z.string().min(1),
	value: z.unknown().optional(),
	onComplete: z.record(z.unknown()).optional(),
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

export const AddItemActionSchema = z.object({
	type: z.literal('addItem'),
	hookId: z.string().min(1),
	stateKey: z.string().min(1),
	idField: z.string().optional(),
	idPrefix: z.string().optional(),
	onComplete: z.record(z.unknown()).optional(),
});

export const RemoveItemActionSchema = z.object({
	type: z.literal('removeItem'),
	hookId: z.string().min(1),
	key: z.string().min(1),
	stateKey: z.string().min(1),
	onComplete: z.record(z.unknown()).optional(),
});

export const UpdateItemActionSchema = z.object({
	type: z.literal('updateItem'),
	hookId: z.string().min(1),
	key: z.string().min(1),
	stateKey: z.string().min(1),
	onComplete: z.record(z.unknown()).optional(),
});

export const ActionDefSchema = z.discriminatedUnion('type', [
	SetStateActionSchema,
	RefreshHookActionSchema,
	NavigateActionSchema,
	SubmitFormActionSchema,
	AddItemActionSchema,
	RemoveItemActionSchema,
	UpdateItemActionSchema,
]);

export type ActionDef = z.infer<typeof ActionDefSchema>;

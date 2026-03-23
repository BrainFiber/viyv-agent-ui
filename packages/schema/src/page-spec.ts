import { z } from 'zod';
import { ActionDefSchema } from './action-def.js';
import { ElementDefSchema } from './element-def.js';
import { HookDefSchema } from './hook-def.js';

export const ParamDefSchema = z.object({
	type: z.enum(['string', 'number']).default('string'),
	default: z.unknown().optional(),
	description: z.string().optional(),
});

export const ThemeSchema = z.object({
	colorScheme: z.enum(['light', 'dark', 'auto']).default('auto'),
	accentColor: z.string().optional(),
	spacing: z.enum(['compact', 'default', 'relaxed']).default('default'),
});

export const PageMetaSchema = z.object({
	createdAt: z.string().datetime().optional(),
	updatedAt: z.string().datetime().optional(),
	createdBy: z.string().optional(),
	tags: z.array(z.string()).optional(),
});

export const PageSpecSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	description: z.string().optional(),
	hooks: z.record(HookDefSchema).default({}),
	root: z.string().min(1),
	elements: z.record(ElementDefSchema),
	state: z.record(z.unknown()).default({}),
	actions: z.record(ActionDefSchema).default({}),
	params: z.record(ParamDefSchema).optional(),
	theme: ThemeSchema.optional(),
	meta: PageMetaSchema.optional(),
});

export type PageSpec = z.infer<typeof PageSpecSchema>;
export type ParamDef = z.infer<typeof ParamDefSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
export type PageMeta = z.infer<typeof PageMetaSchema>;

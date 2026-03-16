import { z } from 'zod';

export const VisibilityConditionSchema = z
	.object({
		expr: z.string(),
	})
	.optional();

export const ElementDefSchema = z.object({
	type: z.string().min(1),
	props: z.record(z.unknown()).default({}),
	children: z.array(z.string().min(1)).optional(),
	visible: VisibilityConditionSchema,
});

export type ElementDef = z.infer<typeof ElementDefSchema>;
export type VisibilityCondition = z.infer<typeof VisibilityConditionSchema>;

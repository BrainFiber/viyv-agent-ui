import { z } from 'zod';

/** JSON Pointer string (RFC 6901): must be empty or start with "/" */
const JsonPointerSchema = z.string().refine((s) => s === '' || s.startsWith('/'), {
	message: 'JSON Pointer must be empty or start with "/"',
});

export const JsonPatchOpSchema = z.discriminatedUnion('op', [
	z.object({ op: z.literal('add'), path: JsonPointerSchema, value: z.unknown() }),
	z.object({ op: z.literal('remove'), path: JsonPointerSchema }),
	z.object({ op: z.literal('replace'), path: JsonPointerSchema, value: z.unknown() }),
	z.object({
		op: z.literal('move'),
		from: JsonPointerSchema,
		path: JsonPointerSchema,
	}),
	z.object({
		op: z.literal('copy'),
		from: JsonPointerSchema,
		path: JsonPointerSchema,
	}),
	z.object({ op: z.literal('test'), path: JsonPointerSchema, value: z.unknown() }),
]);

export const JsonPatchSchema = z.array(JsonPatchOpSchema);

export type JsonPatchOp = z.infer<typeof JsonPatchOpSchema>;
export type JsonPatch = z.infer<typeof JsonPatchSchema>;

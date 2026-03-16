import { z } from 'zod';

export const ColumnMetaSchema = z.object({
	name: z.string().min(1),
	type: z.string().min(1),
	nullable: z.boolean().default(false),
	description: z.string().optional(),
});

export const TableMetaSchema = z.object({
	name: z.string().min(1),
	columns: z.array(ColumnMetaSchema),
	description: z.string().optional(),
	rowCount: z.number().optional(),
});

export const EndpointMetaSchema = z.object({
	path: z.string().min(1),
	method: z.enum(['GET', 'POST']),
	description: z.string().optional(),
	responseSchema: z.record(z.unknown()).optional(),
});

export const DataSourceMetaSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	type: z.enum(['sql', 'rest', 'static']),
	description: z.string().optional(),
	tables: z.array(TableMetaSchema).optional(),
	endpoints: z.array(EndpointMetaSchema).optional(),
});

export type ColumnMeta = z.infer<typeof ColumnMetaSchema>;
export type TableMeta = z.infer<typeof TableMetaSchema>;
export type EndpointMeta = z.infer<typeof EndpointMetaSchema>;
export type DataSourceMeta = z.infer<typeof DataSourceMetaSchema>;

/**
 * DataConnector port interface.
 * Implemented in the server package for each data source type.
 */
export interface DataConnector {
	readonly meta: DataSourceMeta;
	describe(): Promise<DataSourceMeta>;
	query(params: Record<string, unknown>): Promise<unknown>;
}

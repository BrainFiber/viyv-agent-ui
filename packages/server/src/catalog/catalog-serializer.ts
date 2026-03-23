import type { ComponentCatalog, ComponentMeta } from '@viyv/agent-ui-schema';
import { zodToJsonSchema } from 'zod-to-json-schema';

export interface SerializedComponentMeta {
	type: string;
	label: string;
	description: string;
	category: string;
	propsSchema: Record<string, unknown>;
	acceptsChildren: boolean;
	overlay?: boolean;
}

export interface SerializedComponentSummary {
	type: string;
	label: string;
	description: string;
	category: string;
	acceptsChildren: boolean;
	overlay?: boolean;
}

export function serializeComponentSummary(meta: ComponentMeta): SerializedComponentSummary {
	return {
		type: meta.type,
		label: meta.label,
		description: meta.description,
		category: meta.category,
		acceptsChildren: meta.acceptsChildren,
		...(meta.overlay ? { overlay: true } : {}),
	};
}

export function serializeComponentMeta(meta: ComponentMeta): SerializedComponentMeta {
	return {
		...serializeComponentSummary(meta),
		propsSchema: zodToJsonSchema(meta.propsSchema, { target: 'openApi3' }) as Record<
			string,
			unknown
		>,
	};
}

export function serializeCatalog(
	catalog: ComponentCatalog,
	category?: string,
): SerializedComponentSummary[] {
	let components = Object.values(catalog.components);
	if (category) {
		components = components.filter((c) => c.category === category);
	}
	return components.map(serializeComponentSummary);
}

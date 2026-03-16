import type { z } from 'zod';

export interface ComponentMeta {
	type: string;
	label: string;
	description: string;
	category: 'layout' | 'display' | 'data' | 'chart' | 'input';
	propsSchema: z.ZodType;
	acceptsChildren: boolean;
}

export interface ComponentCatalog {
	components: Record<string, ComponentMeta>;
}

export function defineCatalog(components: ComponentMeta[]): ComponentCatalog {
	const map: Record<string, ComponentMeta> = {};
	for (const comp of components) {
		map[comp.type] = comp;
	}
	return { components: map };
}

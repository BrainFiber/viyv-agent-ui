import type { ComponentType } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentRegistry = Map<string, ComponentType<any>>;

export function defineRegistry(
	entries: Record<string, ComponentType<any>>,
): ComponentRegistry {
	return new Map(Object.entries(entries));
}

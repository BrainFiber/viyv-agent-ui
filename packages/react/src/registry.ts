import type { ComponentType } from 'react';

export type ComponentRegistry = Map<string, ComponentType<Record<string, unknown>>>;

export function defineRegistry(
	entries: Record<string, ComponentType<Record<string, unknown>>>,
): ComponentRegistry {
	return new Map(Object.entries(entries));
}

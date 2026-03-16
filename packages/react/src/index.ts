// Core
export { PageRenderer } from './page-renderer.js';
export type { PageRendererProps } from './page-renderer.js';
export { ElementRenderer } from './element-renderer.js';
export type { ElementRendererProps } from './element-renderer.js';
export { defineRegistry } from './registry.js';
export type { ComponentRegistry } from './registry.js';

// Providers
export {
	PageProvider,
	usePageContext,
	usePageSpec,
	useComponent,
} from './providers/page-provider.js';
export type { PageContextValue } from './providers/page-provider.js';
export {
	HookDataProvider,
	useHookDataContext,
} from './providers/hook-data-provider.js';
export type {
	HookDataContextValue,
	HookDataProviderProps,
} from './providers/hook-data-provider.js';
export {
	InteractionProvider,
	useInteractionContext,
} from './providers/interaction-provider.js';
export type {
	InteractionContextValue,
	InteractionProviderProps,
} from './providers/interaction-provider.js';

// Hooks
export { useHookData, useHookLoading, useHookError } from './hooks/use-hook-data.js';
export { useElementProps, useEvalContext } from './hooks/use-element-props.js';
export { usePageState, useAction } from './hooks/use-page-interaction.js';

// Item context (Repeater)
export { ItemProvider, useItemContext } from './providers/item-provider.js';
export type { ItemContextValue } from './providers/item-provider.js';

// Type handlers
export { getTypeHandler } from './renderers/index.js';
export type { TypeHandler } from './renderers/index.js';

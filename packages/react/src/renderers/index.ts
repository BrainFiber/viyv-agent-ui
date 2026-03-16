import type { ElementDef } from '@viyv/agent-ui-schema';
import type { ReactNode } from 'react';
import { renderRepeater } from './repeater-renderer.js';

export type TypeHandler = (
	element: ElementDef,
	resolvedProps: Record<string, unknown>,
) => ReactNode;

const TYPE_HANDLERS: Record<string, TypeHandler> = {
	Repeater: renderRepeater,
};

export function getTypeHandler(type: string): TypeHandler | undefined {
	return TYPE_HANDLERS[type];
}

import type { ElementDef } from '@viyv/agent-ui-schema';
import type { ComponentType } from 'react';
import { FeedRenderer } from './feed-renderer.js';
import { KanbanRenderer } from './kanban-renderer.js';
import { RepeaterRenderer } from './repeater-renderer.js';
import { TimelineRenderer } from './timeline-renderer.js';

export interface TypeHandlerProps {
	element: ElementDef;
	resolvedProps: Record<string, unknown>;
}

export type TypeHandlerComponent = ComponentType<TypeHandlerProps>;

const TYPE_HANDLERS: Record<string, TypeHandlerComponent> = {
	Feed: FeedRenderer,
	Repeater: RepeaterRenderer,
	KanbanBoard: KanbanRenderer,
	Timeline: TimelineRenderer,
};

export function getTypeHandler(type: string): TypeHandlerComponent | undefined {
	return TYPE_HANDLERS[type];
}

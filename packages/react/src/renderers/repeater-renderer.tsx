import type { ElementDef } from '@viyv/agent-ui-schema';
import type { ReactNode } from 'react';
import { ElementRenderer } from '../element-renderer.js';
import { ItemProvider } from '../providers/item-provider.js';

export function renderRepeater(
	element: ElementDef,
	resolvedProps: Record<string, unknown>,
): ReactNode {
	const data = resolvedProps.data;
	const keyField = resolvedProps.keyField as string | undefined;

	if (!Array.isArray(data) || data.length === 0) return null;

	return (
		<>
			{data.map((item, index) => {
				const key =
					keyField && item && typeof item === 'object'
						? String((item as Record<string, unknown>)[keyField])
						: String(index);
				return (
					<ItemProvider key={key} item={item} index={index}>
						{element.children?.map((childId) => (
							<ElementRenderer key={childId} elementId={childId} />
						))}
					</ItemProvider>
				);
			})}
		</>
	);
}

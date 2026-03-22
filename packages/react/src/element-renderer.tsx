import { evaluateVisibility } from '@viyv/agent-ui-engine';
import { useMemo } from 'react';
import { ElementErrorBoundary } from './error-boundary.js';
import { useElementProps, useEvalContext } from './hooks/use-element-props.js';
import { useComponent, usePageSpec } from './providers/page-provider.js';
import { getTypeHandler } from './renderers/index.js';

export interface ElementRendererProps {
	elementId: string;
}

export function ElementRenderer({ elementId }: ElementRendererProps) {
	const spec = usePageSpec();
	const element = spec.elements[elementId];

	const ctx = useEvalContext();
	const visible = useMemo(() => evaluateVisibility(element?.visible, ctx), [element?.visible, ctx]);

	const resolvedProps = useElementProps(element?.props ?? {});

	// useComponent must be called unconditionally (React hooks rules)
	const Component = useComponent(element?.type ?? '');

	if (!element || !visible) return null;

	// Type handler (Repeater etc.)
	const TypeHandler = getTypeHandler(element.type);
	if (TypeHandler) {
		return (
			<ElementErrorBoundary elementId={elementId} elementType={element.type}>
				<TypeHandler element={element} resolvedProps={resolvedProps} />
			</ElementErrorBoundary>
		);
	}

	// Normal component rendering
	if (!Component) return null;

	return (
		<ElementErrorBoundary elementId={elementId} elementType={element.type}>
			<Component {...resolvedProps}>
				{element.children?.map((childId) => (
					<ElementRenderer key={childId} elementId={childId} />
				))}
			</Component>
		</ElementErrorBoundary>
	);
}

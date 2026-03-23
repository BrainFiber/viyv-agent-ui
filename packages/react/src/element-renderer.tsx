import { evaluateVisibility } from '@viyv/agent-ui-engine';
import { useMemo } from 'react';
import { ElementErrorBoundary } from './error-boundary.js';
import { useElementProps, useEvalContext } from './hooks/use-element-props.js';
import { useComponent, usePageSpec } from './providers/page-provider.js';
import { usePageContext } from './providers/page-provider.js';
import { getTypeHandler } from './renderers/index.js';

export interface ElementRendererProps {
	elementId: string;
}

export function ElementRenderer({ elementId }: ElementRendererProps) {
	const spec = usePageSpec();
	const element = spec.elements[elementId];
	const { overlayTypes } = usePageContext();

	const ctx = useEvalContext();
	const visible = useMemo(() => evaluateVisibility(element?.visible, ctx), [element?.visible, ctx]);

	const resolvedProps = useElementProps(element?.props ?? {});

	// useComponent must be called unconditionally (React hooks rules)
	const Component = useComponent(element?.type ?? '');

	if (!element) return null;

	// Overlay components receive `open` prop instead of being unmounted
	const isOverlay = overlayTypes?.has(element.type) === true;
	if (!visible && !isOverlay) return null;

	const effectiveProps = isOverlay ? { ...resolvedProps, open: visible } : resolvedProps;

	const idWrapper = { display: 'contents' } as const;

	// Type handler (Repeater etc.)
	const TypeHandler = getTypeHandler(element.type);
	if (TypeHandler) {
		return (
			<ElementErrorBoundary elementId={elementId} elementType={element.type}>
				<div data-element-id={elementId} style={idWrapper}>
					<TypeHandler element={element} resolvedProps={effectiveProps} />
				</div>
			</ElementErrorBoundary>
		);
	}

	// Normal component rendering
	if (!Component) return null;

	return (
		<ElementErrorBoundary elementId={elementId} elementType={element.type}>
			<div data-element-id={elementId} style={idWrapper}>
				<Component {...effectiveProps}>
					{element.children?.map((childId) => (
						<ElementRenderer key={childId} elementId={childId} />
					))}
				</Component>
			</div>
		</ElementErrorBoundary>
	);
}

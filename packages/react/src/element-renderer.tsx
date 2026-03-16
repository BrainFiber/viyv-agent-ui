import { evaluateVisibility } from '@viyv/agent-ui-engine';
import { useMemo } from 'react';
import { useElementProps, useEvalContext } from './hooks/use-element-props.js';
import { useComponent, usePageSpec } from './providers/page-provider.js';

export interface ElementRendererProps {
	elementId: string;
}

export function ElementRenderer({ elementId }: ElementRendererProps) {
	const spec = usePageSpec();
	const element = spec.elements[elementId];

	const ctx = useEvalContext();
	const visible = useMemo(() => evaluateVisibility(element?.visible, ctx), [element?.visible, ctx]);

	const resolvedProps = useElementProps(element?.props ?? {});
	const Component = useComponent(element?.type ?? '');

	if (!element || !visible || !Component) return null;

	return (
		<Component {...resolvedProps}>
			{element.children?.map((childId) => (
				<ElementRenderer key={childId} elementId={childId} />
			))}
		</Component>
	);
}

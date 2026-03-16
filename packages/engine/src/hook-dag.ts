import type { HookDef } from '@viyv/agent-ui-schema';

export interface HookNode {
	id: string;
	hook: HookDef;
	dependencies: string[];
}

export interface HookDAG {
	nodes: Map<string, HookNode>;
	layers: string[][]; // Each layer can execute in parallel
	order: string[]; // Topological order
}

export function buildHookDAG(hooks: Record<string, HookDef>): HookDAG {
	const nodes = new Map<string, HookNode>();

	// Build nodes with dependencies
	for (const [id, hook] of Object.entries(hooks)) {
		const dependencies: string[] = [];
		if (hook.use === 'useDerived') {
			dependencies.push(hook.from);
		}
		nodes.set(id, { id, hook, dependencies });
	}

	// Topological sort (Kahn's algorithm)
	const inDegree = new Map<string, number>();
	const adjacency = new Map<string, string[]>();

	for (const [id, node] of nodes) {
		inDegree.set(id, node.dependencies.length);
		for (const dep of node.dependencies) {
			const adj = adjacency.get(dep) ?? [];
			adj.push(id);
			adjacency.set(dep, adj);
		}
	}

	const layers: string[][] = [];
	const order: string[] = [];
	let queue = [...nodes.keys()].filter((id) => (inDegree.get(id) ?? 0) === 0);

	while (queue.length > 0) {
		layers.push([...queue]);
		order.push(...queue);

		const nextQueue: string[] = [];
		for (const id of queue) {
			for (const neighbor of adjacency.get(id) ?? []) {
				const deg = (inDegree.get(neighbor) ?? 1) - 1;
				inDegree.set(neighbor, deg);
				if (deg === 0) {
					nextQueue.push(neighbor);
				}
			}
		}
		queue = nextQueue;
	}

	// Check for cycles (unvisited nodes)
	if (order.length !== nodes.size) {
		const missing = [...nodes.keys()].filter((id) => !order.includes(id));
		throw new Error(`Circular dependency detected in hooks: ${missing.join(', ')}`);
	}

	return { nodes, layers, order };
}

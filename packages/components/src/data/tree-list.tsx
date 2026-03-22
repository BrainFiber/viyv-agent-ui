import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState } from 'react';

export interface TreeListProps {
	data: unknown;
	labelKey?: string;
	childrenKey?: string;
	idKey?: string;
	defaultExpanded?: boolean;
	className?: string;
}

function normalizeTreeData(data: unknown): Record<string, unknown>[] {
	if (Array.isArray(data)) return data as Record<string, unknown>[];
	if (data && typeof data === 'object' && 'rows' in data) {
		const rows = (data as { rows: unknown }).rows;
		if (Array.isArray(rows)) return rows as Record<string, unknown>[];
	}
	return [];
}

function collectAllIds(
	nodes: Record<string, unknown>[],
	idKey: string,
	childrenKey: string,
): string[] {
	const ids: string[] = [];
	for (const node of nodes) {
		const id = String(node[idKey] ?? '');
		if (id) ids.push(id);
		const children = node[childrenKey];
		if (Array.isArray(children)) {
			ids.push(...collectAllIds(children as Record<string, unknown>[], idKey, childrenKey));
		}
	}
	return ids;
}

interface TreeNodeProps {
	node: Record<string, unknown>;
	labelKey: string;
	childrenKey: string;
	idKey: string;
	level: number;
	expanded: Set<string>;
	onToggle: (id: string) => void;
}

function TreeNode({ node, labelKey, childrenKey, idKey, level, expanded, onToggle }: TreeNodeProps) {
	const id = String(node[idKey] ?? '');
	const label = String(node[labelKey] ?? '');
	const children = Array.isArray(node[childrenKey])
		? (node[childrenKey] as Record<string, unknown>[])
		: undefined;
	const hasChildren = children && children.length > 0;
	const isExpanded = expanded.has(id);

	return (
		<li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
			<div
				className="flex items-center py-1 cursor-default hover:bg-surface-alt rounded"
				style={{ paddingLeft: `${level * 20}px` }}
			>
				{hasChildren ? (
					<button
						type="button"
						className="mr-1 w-5 h-5 flex items-center justify-center text-fg-muted hover:text-fg-secondary"
						onClick={() => onToggle(id)}
						aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
					>
						{isExpanded ? '▼' : '▶'}
					</button>
				) : (
					<span className="mr-1 w-5 h-5 flex items-center justify-center text-fg-subtle">•</span>
				)}
				<span className="text-sm text-fg">{label}</span>
			</div>
			{hasChildren && isExpanded && (
				<ul role="group">
					{children.map((child, i) => (
						<TreeNode
							key={String(child[idKey] ?? i)}
							node={child}
							labelKey={labelKey}
							childrenKey={childrenKey}
							idKey={idKey}
							level={level + 1}
							expanded={expanded}
							onToggle={onToggle}
						/>
					))}
				</ul>
			)}
		</li>
	);
}

export function TreeList({
	data,
	labelKey = 'label',
	childrenKey = 'children',
	idKey = 'id',
	defaultExpanded = false,
	className,
}: TreeListProps) {
	const nodes = normalizeTreeData(data);

	const [expanded, setExpanded] = useState<Set<string>>(() => {
		if (defaultExpanded) {
			return new Set(collectAllIds(nodes, idKey, childrenKey));
		}
		return new Set<string>();
	});

	const handleToggle = (id: string) => {
		setExpanded((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	return (
		<ul role="tree" aria-label="Tree" className={className}>
			{nodes.map((node, i) => (
				<TreeNode
					key={String(node[idKey] ?? i)}
					node={node}
					labelKey={labelKey}
					childrenKey={childrenKey}
					idKey={idKey}
					level={0}
					expanded={expanded}
					onToggle={handleToggle}
				/>
			))}
		</ul>
	);
}

export const treeListMeta: ComponentMeta = {
	type: 'TreeList',
	label: 'Tree List',
	description: 'Hierarchical tree view with expand/collapse for nested data',
	category: 'data',
	propsSchema: z.object({
		data: z.unknown(),
		labelKey: z.string().optional(),
		childrenKey: z.string().optional(),
		idKey: z.string().optional(),
		defaultExpanded: z.boolean().optional(),
	}),
	acceptsChildren: false,
};

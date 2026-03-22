import { z } from 'zod';
import type { ComponentMeta } from '@viyv/agent-ui-schema';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { KeyboardEvent } from 'react';
import { normalizeData } from '../lib/normalize-data.js';
import { ChevronDown, ChevronRight, Dot } from '../lib/icons.js';

export interface TreeListProps {
	data: unknown;
	labelKey?: string;
	childrenKey?: string;
	idKey?: string;
	defaultExpanded?: boolean;
	className?: string;
}

function normalizeTreeData(data: unknown): Record<string, unknown>[] {
	return normalizeData(data, 'TreeList');
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

/**
 * Collect the IDs of all visible nodes (i.e. nodes whose ancestors are all expanded)
 * in depth-first DOM order.
 */
function collectVisibleIds(
	nodes: Record<string, unknown>[],
	idKey: string,
	childrenKey: string,
	expanded: Set<string>,
): string[] {
	const result: string[] = [];
	for (const node of nodes) {
		const id = String(node[idKey] ?? '');
		result.push(id);
		const children = node[childrenKey];
		if (Array.isArray(children) && children.length > 0 && expanded.has(id)) {
			result.push(...collectVisibleIds(children as Record<string, unknown>[], idKey, childrenKey, expanded));
		}
	}
	return result;
}

/**
 * Find the parent ID of a given node ID.
 */
function findParentId(
	nodes: Record<string, unknown>[],
	targetId: string,
	idKey: string,
	childrenKey: string,
	parentId: string | null = null,
): string | null {
	for (const node of nodes) {
		const id = String(node[idKey] ?? '');
		if (id === targetId) return parentId;
		const children = node[childrenKey];
		if (Array.isArray(children) && children.length > 0) {
			const found = findParentId(children as Record<string, unknown>[], targetId, idKey, childrenKey, id);
			if (found !== undefined && found !== null) return found;
		}
	}
	return null;
}

/**
 * Find a node by ID in the tree.
 */
function findNode(
	nodes: Record<string, unknown>[],
	targetId: string,
	idKey: string,
	childrenKey: string,
): Record<string, unknown> | null {
	for (const node of nodes) {
		const id = String(node[idKey] ?? '');
		if (id === targetId) return node;
		const children = node[childrenKey];
		if (Array.isArray(children) && children.length > 0) {
			const found = findNode(children as Record<string, unknown>[], targetId, idKey, childrenKey);
			if (found) return found;
		}
	}
	return null;
}

interface TreeNodeProps {
	node: Record<string, unknown>;
	labelKey: string;
	childrenKey: string;
	idKey: string;
	level: number;
	expanded: Set<string>;
	onToggle: (id: string) => void;
	focusedId: string | null;
	onFocusNode: (id: string) => void;
}

function TreeNode({ node, labelKey, childrenKey, idKey, level, expanded, onToggle, focusedId, onFocusNode }: TreeNodeProps) {
	const id = String(node[idKey] ?? '');
	const label = String(node[labelKey] ?? '');
	const children = Array.isArray(node[childrenKey])
		? (node[childrenKey] as Record<string, unknown>[])
		: undefined;
	const hasChildren = children && children.length > 0;
	const isExpanded = expanded.has(id);
	const isFocused = focusedId === id;
	const rowRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isFocused && rowRef.current) {
			rowRef.current.focus();
		}
	}, [isFocused]);

	return (
		<li role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
			<div
				ref={rowRef}
				className="flex items-center py-1 cursor-default transition-colors hover:bg-muted/50 rounded"
				style={{ paddingLeft: `${level * 20}px` }}
				tabIndex={isFocused ? 0 : -1}
				onFocus={() => onFocusNode(id)}
			>
				{hasChildren ? (
					<button
						type="button"
						tabIndex={-1}
						className="mr-1 w-5 h-5 flex items-center justify-center text-fg-muted hover:text-fg-secondary"
						onClick={() => onToggle(id)}
						aria-label={isExpanded ? `Collapse ${label}` : `Expand ${label}`}
					>
						{isExpanded ? <ChevronDown aria-hidden="true" className="h-4 w-4" /> : <ChevronRight aria-hidden="true" className="h-4 w-4" />}
					</button>
				) : (
					<span className="mr-1 w-5 h-5 flex items-center justify-center text-fg-subtle"><Dot aria-hidden="true" className="h-4 w-4" /></span>
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
							focusedId={focusedId}
							onFocusNode={onFocusNode}
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

	const [focusedId, setFocusedId] = useState<string | null>(null);

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

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			const visibleIds = collectVisibleIds(nodes, idKey, childrenKey, expanded);
			if (visibleIds.length === 0) return;

			const currentIndex = focusedId ? visibleIds.indexOf(focusedId) : -1;

			switch (e.key) {
				case 'ArrowDown': {
					e.preventDefault();
					const nextIndex = currentIndex < visibleIds.length - 1 ? currentIndex + 1 : currentIndex;
					setFocusedId(visibleIds[nextIndex]);
					break;
				}
				case 'ArrowUp': {
					e.preventDefault();
					const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0;
					setFocusedId(visibleIds[prevIndex]);
					break;
				}
				case 'ArrowRight': {
					e.preventDefault();
					if (focusedId) {
						const node = findNode(nodes, focusedId, idKey, childrenKey);
						if (node) {
							const children = node[childrenKey];
							const hasChildren = Array.isArray(children) && children.length > 0;
							if (hasChildren && !expanded.has(focusedId)) {
								// Expand
								handleToggle(focusedId);
							} else if (hasChildren && expanded.has(focusedId)) {
								// Move to first child
								const firstChildId = String((children as Record<string, unknown>[])[0][idKey] ?? '');
								if (firstChildId) setFocusedId(firstChildId);
							}
						}
					}
					break;
				}
				case 'ArrowLeft': {
					e.preventDefault();
					if (focusedId) {
						const node = findNode(nodes, focusedId, idKey, childrenKey);
						if (node) {
							const children = node[childrenKey];
							const hasChildren = Array.isArray(children) && children.length > 0;
							if (hasChildren && expanded.has(focusedId)) {
								// Collapse
								handleToggle(focusedId);
							} else {
								// Move to parent
								const parentId = findParentId(nodes, focusedId, idKey, childrenKey);
								if (parentId) setFocusedId(parentId);
							}
						}
					}
					break;
				}
				case 'Home': {
					e.preventDefault();
					if (visibleIds.length > 0) setFocusedId(visibleIds[0]);
					break;
				}
				case 'End': {
					e.preventDefault();
					if (visibleIds.length > 0) setFocusedId(visibleIds[visibleIds.length - 1]);
					break;
				}
				case 'Enter':
				case ' ': {
					e.preventDefault();
					if (focusedId) {
						const node = findNode(nodes, focusedId, idKey, childrenKey);
						if (node) {
							const children = node[childrenKey];
							const hasChildren = Array.isArray(children) && children.length > 0;
							if (hasChildren) handleToggle(focusedId);
						}
					}
					break;
				}
			}
		},
		[nodes, idKey, childrenKey, expanded, focusedId],
	);

	return (
		<ul role="tree" aria-label="Tree" className={className} onKeyDown={handleKeyDown}>
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
					focusedId={focusedId}
					onFocusNode={setFocusedId}
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

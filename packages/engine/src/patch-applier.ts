import type { JsonPatch, JsonPatchOp } from '@viyv/agent-ui-schema';
import type { PageSpec } from '@viyv/agent-ui-schema';

/**
 * Apply an RFC 6902 JSON Patch to a PageSpec (immutable -- returns a new object).
 */
export function applyPatch(spec: PageSpec, patch: JsonPatch): PageSpec {
	let result = structuredClone(spec);

	for (const op of patch) {
		result = applyOp(result, op);
	}

	return result;
}

function applyOp(obj: PageSpec, op: JsonPatchOp): PageSpec {
	const result = structuredClone(obj);

	switch (op.op) {
		case 'add': {
			addAtPath(result, op.path, op.value);
			break;
		}
		case 'remove': {
			removeAtPath(result, op.path);
			break;
		}
		case 'replace': {
			replaceAtPath(result, op.path, op.value);
			break;
		}
		case 'move': {
			const value = getAtPath(result, op.from);
			removeAtPath(result, op.from);
			addAtPath(result, op.path, value);
			break;
		}
		case 'copy': {
			const value = getAtPath(result, op.from);
			addAtPath(result, op.path, structuredClone(value));
			break;
		}
		case 'test': {
			const current = getAtPath(result, op.path);
			if (JSON.stringify(current) !== JSON.stringify(op.value)) {
				throw new Error(`Test failed at path "${op.path}"`);
			}
			break;
		}
	}

	return result;
}

function parsePath(path: string): string[] {
	if (path === '') return [];
	if (!path.startsWith('/')) {
		throw new Error(`Invalid JSON Pointer: "${path}"`);
	}
	return path
		.slice(1)
		.split('/')
		.map((seg) => seg.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function navigateToParent(obj: unknown, segments: string[]): unknown {
	let current: unknown = obj;
	for (let i = 0; i < segments.length - 1; i++) {
		const seg = segments[i];
		if (current == null || typeof current !== 'object') {
			throw new Error(`Path segment "${seg}" not found`);
		}
		if (Array.isArray(current)) {
			const idx = Number(seg);
			if (!Number.isInteger(idx) || idx < 0 || idx >= current.length) {
				throw new Error(`Invalid array index: "${seg}"`);
			}
			current = current[idx];
		} else {
			current = (current as Record<string, unknown>)[seg];
		}
	}
	return current;
}

function getAtPath(obj: unknown, path: string): unknown {
	const segments = parsePath(path);
	let current: unknown = obj;
	for (const seg of segments) {
		if (current == null || typeof current !== 'object') return undefined;
		if (Array.isArray(current)) {
			current = current[Number(seg)];
		} else {
			current = (current as Record<string, unknown>)[seg];
		}
	}
	return current;
}

/**
 * RFC 6902 "add": for arrays, insert at index; for objects, set the member.
 */
function addAtPath(obj: unknown, path: string, value: unknown): void {
	const segments = parsePath(path);
	if (segments.length === 0) {
		throw new Error('Cannot replace root');
	}

	const current = navigateToParent(obj, segments);

	if (current == null || typeof current !== 'object') {
		throw new Error('Cannot set value at path');
	}

	const lastSeg = segments[segments.length - 1];
	if (Array.isArray(current)) {
		if (lastSeg === '-') {
			current.push(value);
		} else {
			const index = Number(lastSeg);
			if (!Number.isInteger(index) || index < 0 || index > current.length) {
				throw new Error(`Invalid array index: "${lastSeg}"`);
			}
			current.splice(index, 0, value);
		}
	} else {
		(current as Record<string, unknown>)[lastSeg] = value;
	}
}

/**
 * RFC 6902 "replace": the target location must already exist.
 */
function replaceAtPath(obj: unknown, path: string, value: unknown): void {
	const segments = parsePath(path);
	if (segments.length === 0) {
		throw new Error('Cannot replace root');
	}

	const current = navigateToParent(obj, segments);

	if (current == null || typeof current !== 'object') {
		throw new Error('Cannot set value at path');
	}

	const lastSeg = segments[segments.length - 1];
	if (Array.isArray(current)) {
		const index = Number(lastSeg);
		if (!Number.isInteger(index) || index < 0 || index >= current.length) {
			throw new Error(`Invalid array index for replace: "${lastSeg}"`);
		}
		current[index] = value;
	} else {
		(current as Record<string, unknown>)[lastSeg] = value;
	}
}

function removeAtPath(obj: unknown, path: string): void {
	const segments = parsePath(path);
	if (segments.length === 0) {
		throw new Error('Cannot remove root');
	}

	let current: unknown = obj;
	for (let i = 0; i < segments.length - 1; i++) {
		const seg = segments[i];
		if (current == null || typeof current !== 'object') return;
		if (Array.isArray(current)) {
			current = current[Number(seg)];
		} else {
			current = (current as Record<string, unknown>)[seg];
		}
	}

	if (current == null || typeof current !== 'object') return;

	const lastSeg = segments[segments.length - 1];
	if (Array.isArray(current)) {
		const index = Number(lastSeg);
		if (!Number.isInteger(index) || index < 0 || index >= current.length) {
			throw new Error(`Invalid array index for remove: "${lastSeg}"`);
		}
		current.splice(index, 1);
	} else {
		delete (current as Record<string, unknown>)[lastSeg];
	}
}

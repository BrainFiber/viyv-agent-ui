import type { PageSpec } from '@viyv/agent-ui-schema';
import { describe, expect, it } from 'vitest';
import { applyPatch } from '../patch-applier.js';

const baseSpec: PageSpec = {
	id: 'test',
	title: 'Test Page',
	root: 'root',
	elements: {
		root: { type: 'Stack', props: { direction: 'vertical' }, children: ['header'] },
		header: { type: 'Header', props: { title: 'Hello' } },
	},
	hooks: {},
	state: {},
	actions: {},
};

describe('applyPatch', () => {
	it('adds a new element', () => {
		const result = applyPatch(baseSpec, [
			{
				op: 'add',
				path: '/elements/footer',
				value: { type: 'Text', props: { content: 'Footer' } },
			},
		]);
		expect(result.elements.footer).toBeDefined();
		expect(result.elements.footer.type).toBe('Text');
	});

	it('replaces a prop', () => {
		const result = applyPatch(baseSpec, [
			{ op: 'replace', path: '/elements/header/props/title', value: 'Updated' },
		]);
		expect(result.elements.header.props.title).toBe('Updated');
	});

	it('removes an element', () => {
		const result = applyPatch(baseSpec, [{ op: 'remove', path: '/elements/header' }]);
		expect(result.elements.header).toBeUndefined();
	});

	it('does not mutate original', () => {
		applyPatch(baseSpec, [{ op: 'replace', path: '/title', value: 'Changed' }]);
		expect(baseSpec.title).toBe('Test Page');
	});

	it('throws on failed test', () => {
		expect(() => applyPatch(baseSpec, [{ op: 'test', path: '/title', value: 'Wrong' }])).toThrow(
			'Test failed',
		);
	});

	it('throws on invalid JSON Pointer', () => {
		expect(() =>
			applyPatch(baseSpec, [{ op: 'add', path: 'no-leading-slash', value: 'x' }]),
		).toThrow('Invalid JSON Pointer');
	});

	it('handles add to array with "-" (append)', () => {
		const specWithArray: PageSpec = {
			...baseSpec,
			elements: {
				root: {
					type: 'Stack',
					props: {},
					children: ['header'],
				},
				header: { type: 'Header', props: { title: 'Hello' } },
			},
		};
		const result = applyPatch(specWithArray, [
			{ op: 'add', path: '/elements/root/children/-', value: 'footer' },
		]);
		expect(result.elements.root.children).toEqual(['header', 'footer']);
	});

	it('handles move operation', () => {
		const result = applyPatch(baseSpec, [
			{ op: 'move', from: '/elements/header/props/title', path: '/elements/root/props/label' },
		]);
		expect(result.elements.root.props.label).toBe('Hello');
		expect(result.elements.header.props.title).toBeUndefined();
	});

	it('handles copy operation', () => {
		const result = applyPatch(baseSpec, [
			{ op: 'copy', from: '/elements/header/props/title', path: '/elements/root/props/label' },
		]);
		expect(result.elements.root.props.label).toBe('Hello');
		expect(result.elements.header.props.title).toBe('Hello');
	});

	it('handles test operation with matching value', () => {
		const result = applyPatch(baseSpec, [{ op: 'test', path: '/title', value: 'Test Page' }]);
		expect(result.title).toBe('Test Page');
	});
});

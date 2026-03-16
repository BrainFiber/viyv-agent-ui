import type { PageSpec } from '@viyv/agent-ui-schema';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryPageStore } from '../store/memory-page-store.js';

const sampleSpec: PageSpec = {
	id: 'test-page',
	title: 'Test Page',
	root: 'root',
	elements: {
		root: { type: 'Stack', props: { direction: 'vertical' } },
	},
	hooks: {},
	state: {},
	actions: {},
};

describe('MemoryPageStore', () => {
	let store: MemoryPageStore;

	beforeEach(() => {
		store = new MemoryPageStore();
	});

	it('saves and retrieves a page', async () => {
		const saved = await store.save(sampleSpec);
		expect(saved.id).toBe('test-page');

		const retrieved = await store.get('test-page');
		expect(retrieved).not.toBeNull();
		expect(retrieved!.spec.title).toBe('Test Page');
	});

	it('lists pages sorted by updatedAt desc', async () => {
		await store.save({ ...sampleSpec, id: 'a', title: 'Page A' });
		await store.save({ ...sampleSpec, id: 'b', title: 'Page B' });

		const pages = await store.list();
		expect(pages).toHaveLength(2);
		// Most recently saved should be first
		expect(pages[0].id).toBe('b');
	});

	it('updates a page', async () => {
		await store.save(sampleSpec);
		const updated = await store.update('test-page', {
			...sampleSpec,
			title: 'Updated Title',
		});
		expect(updated.spec.title).toBe('Updated Title');
	});

	it('throws when updating non-existent page', async () => {
		await expect(store.update('missing', sampleSpec)).rejects.toThrow('not found');
	});

	it('deletes a page', async () => {
		await store.save(sampleSpec);
		await store.delete('test-page');
		const retrieved = await store.get('test-page');
		expect(retrieved).toBeNull();
	});

	it('saves and retrieves preview', async () => {
		const preview = await store.savePreview(sampleSpec);
		expect(preview.previewId).toBeTruthy();
		expect(preview.expiresAt.getTime()).toBeGreaterThan(Date.now());

		const spec = await store.getPreview(preview.previewId);
		expect(spec).not.toBeNull();
		expect(spec!.title).toBe('Test Page');
	});

	it('returns null for expired preview', async () => {
		const store = new MemoryPageStore({ previewTtlMs: -1 });
		const preview = await store.savePreview(sampleSpec);
		const spec = await store.getPreview(preview.previewId);
		expect(spec).toBeNull();
	});

	it('returns null for non-existent page', async () => {
		expect(await store.get('nope')).toBeNull();
	});
});

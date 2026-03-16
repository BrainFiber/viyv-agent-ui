import type { PageSpec, PageStore, PageStorePage } from '@viyv/agent-ui-schema';
import { nanoid } from 'nanoid';

interface PreviewEntry {
	spec: PageSpec;
	expiresAt: Date;
}

export class MemoryPageStore implements PageStore {
	private pages = new Map<string, PageStorePage>();
	private previews = new Map<string, PreviewEntry>();
	private previewTtlMs: number;
	private sequence = new Map<string, number>();
	private seqCounter = 0;

	constructor(options?: { previewTtlMs?: number }) {
		this.previewTtlMs = options?.previewTtlMs ?? 30 * 60 * 1000; // 30 min default
	}

	async list(): Promise<PageStorePage[]> {
		return [...this.pages.values()].sort((a, b) => {
			const timeDiff = b.updatedAt.getTime() - a.updatedAt.getTime();
			if (timeDiff !== 0) return timeDiff;
			return (this.sequence.get(b.id) ?? 0) - (this.sequence.get(a.id) ?? 0);
		});
	}

	async get(id: string): Promise<PageStorePage | null> {
		return this.pages.get(id) ?? null;
	}

	async save(spec: PageSpec): Promise<PageStorePage> {
		const now = new Date();
		const page: PageStorePage = {
			id: spec.id,
			spec,
			createdAt: now,
			updatedAt: now,
		};
		this.pages.set(spec.id, page);
		this.sequence.set(spec.id, this.seqCounter++);
		return page;
	}

	async update(id: string, spec: PageSpec): Promise<PageStorePage> {
		const existing = this.pages.get(id);
		if (!existing) {
			throw new Error(`Page "${id}" not found`);
		}
		const page: PageStorePage = {
			...existing,
			spec: { ...spec, id },
			updatedAt: new Date(),
		};
		this.pages.set(id, page);
		this.sequence.set(id, this.seqCounter++);
		return page;
	}

	async delete(id: string): Promise<void> {
		this.pages.delete(id);
		this.sequence.delete(id);
	}

	async savePreview(spec: PageSpec): Promise<{ previewId: string; expiresAt: Date }> {
		const previewId = nanoid(12);
		const expiresAt = new Date(Date.now() + this.previewTtlMs);
		this.previews.set(previewId, { spec, expiresAt });
		return { previewId, expiresAt };
	}

	async getPreview(previewId: string): Promise<PageSpec | null> {
		const entry = this.previews.get(previewId);
		if (!entry) return null;
		if (entry.expiresAt < new Date()) {
			this.previews.delete(previewId);
			return null;
		}
		return entry.spec;
	}
}

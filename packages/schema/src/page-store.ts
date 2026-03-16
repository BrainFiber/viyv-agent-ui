import type { PageSpec } from './page-spec.js';

export interface PageStorePage {
	id: string;
	spec: PageSpec;
	createdAt: Date;
	updatedAt: Date;
}

export interface PageStore {
	list(): Promise<PageStorePage[]>;
	get(id: string): Promise<PageStorePage | null>;
	save(spec: PageSpec): Promise<PageStorePage>;
	update(id: string, spec: PageSpec): Promise<PageStorePage>;
	delete(id: string): Promise<void>;
	savePreview(spec: PageSpec): Promise<{ previewId: string; expiresAt: Date }>;
	getPreview(previewId: string): Promise<PageSpec | null>;
}

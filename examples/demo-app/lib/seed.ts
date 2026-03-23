import { pageStore, registry } from './agent-ui-config';
import { getViyvDbConnector } from './viyv-db-connector';
import { dashboardSpec } from '../data/dashboard';
import { dataManagementSpec } from '../data/data-management';
import { formBuilderSpec } from '../data/form-builder';
import { ecommerceProductSpec } from '../data/ecommerce-product';
import { settingsPanelSpec } from '../data/settings-panel';
import { contentBlogSpec } from '../data/content-blog';
import { navigationShowcaseSpec } from '../data/navigation-showcase';
import { overlayFeedbackSpec } from '../data/overlay-feedback';
import { kanbanProjectSpec } from '../data/kanban-project';
import { timelineActivitySpec } from '../data/timeline-activity';
import { delightfulShowcaseSpec } from '../data/delightful-showcase';

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
	if (!seedPromise) {
		seedPromise = (async () => {
			await pageStore.save(dashboardSpec);
			await pageStore.save(dataManagementSpec);
			await pageStore.save(formBuilderSpec);
			await pageStore.save(ecommerceProductSpec);
			await pageStore.save(settingsPanelSpec);
			await pageStore.save(contentBlogSpec);
			await pageStore.save(navigationShowcaseSpec);
			await pageStore.save(overlayFeedbackSpec);
			await pageStore.save(kanbanProjectSpec);
			await pageStore.save(timelineActivitySpec);
			await pageStore.save(delightfulShowcaseSpec);

			const connector = await getViyvDbConnector();
			if (connector) {
				registry.register(connector);
				await connector.describe();
			}
		})();
	}
	return seedPromise;
}

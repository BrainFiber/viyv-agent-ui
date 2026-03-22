import { pageStore, registry } from './agent-ui-config';
import { getViyvDbConnector } from './viyv-db-connector';
import { salesDashboardSpec } from '../data/sales-dashboard';
import { simpleProfileSpec } from '../data/simple-profile';
import { taskBoardSpec } from '../data/task-board';
import { taskDetailSpec } from '../data/task-detail';
import { reportsDashboardSpec } from '../data/reports-dashboard';
import { supportTicketsSpec } from '../data/support-tickets';
import { inventorySpec } from '../data/inventory';
import { apiMonitoringSpec } from '../data/api-monitoring';
import { ecProductListSpec } from '../data/ec-product-list';
import { ecProductDetailSpec } from '../data/ec-product-detail';
import { ecOrdersSpec } from '../data/ec-orders';
import { analyticsSpec } from '../data/analytics';
import { userManagementSpec } from '../data/user-management';
import { monitoringV2Spec } from '../data/monitoring-v2';
import { searchResultsSpec } from '../data/search-results';
import { storeLocatorSpec } from '../data/store-locator';
import { contactFormSpec } from '../data/contact-form';
import { timelineFeedSpec } from '../data/timeline-feed';
import { projectStructureSpec } from '../data/project-structure';
import { ganttScheduleSpec } from '../data/gantt-schedule';
import { kanbanBoardSpec } from '../data/kanban-board';
import { backlogSpec } from '../data/backlog';
import { ticketDetailPmSpec } from '../data/ticket-detail-pm';
import { settingsPageSpec } from '../data/settings-page';
import { productDetailSpec } from '../data/product-detail';
import { teamDirectorySpec } from '../data/team-directory';
import { onboardingWizardSpec } from '../data/onboarding-wizard';

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
	if (!seedPromise) {
		seedPromise = (async () => {
			await pageStore.save(salesDashboardSpec);
			await pageStore.save(simpleProfileSpec);
			await pageStore.save(taskBoardSpec);
			await pageStore.save(taskDetailSpec);
			await pageStore.save(supportTicketsSpec);
			await pageStore.save(inventorySpec);
			await pageStore.save(apiMonitoringSpec);
			await pageStore.save(ecProductListSpec);
			await pageStore.save(ecProductDetailSpec);
			await pageStore.save(ecOrdersSpec);
			await pageStore.save(analyticsSpec);
			await pageStore.save(userManagementSpec);
			await pageStore.save(monitoringV2Spec);
			await pageStore.save(searchResultsSpec);
			await pageStore.save(storeLocatorSpec);
			await pageStore.save(contactFormSpec);
			await pageStore.save(timelineFeedSpec);
			await pageStore.save(projectStructureSpec);
			await pageStore.save(ganttScheduleSpec);
			await pageStore.save(kanbanBoardSpec);
			await pageStore.save(backlogSpec);
			await pageStore.save(ticketDetailPmSpec);
			await pageStore.save(settingsPageSpec);
			await pageStore.save(productDetailSpec);
			await pageStore.save(teamDirectorySpec);
			await pageStore.save(onboardingWizardSpec);

			const connector = await getViyvDbConnector();
			if (connector) {
				registry.register(connector);
				await connector.describe();
				await pageStore.save(reportsDashboardSpec);
			}
		})();
	}
	return seedPromise;
}

import { pageStore, registry } from './agent-ui-config';
import { getViyvDbConnector } from './viyv-db-connector';
import { salesDashboardSpec } from '../data/sales-dashboard';
import { simpleProfileSpec } from '../data/simple-profile';
import { taskBoardSpec } from '../data/task-board';
import { taskDetailSpec } from '../data/task-detail';
import { reportsDashboardSpec } from '../data/reports-dashboard';

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
	if (!seedPromise) {
		seedPromise = (async () => {
			await pageStore.save(salesDashboardSpec);
			await pageStore.save(simpleProfileSpec);
			await pageStore.save(taskBoardSpec);
			await pageStore.save(taskDetailSpec);

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

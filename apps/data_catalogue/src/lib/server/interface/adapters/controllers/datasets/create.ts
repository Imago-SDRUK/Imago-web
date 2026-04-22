import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { datasetCreateUseCase } from '$lib/server/application/use_cases/datasets/create'
import { groupAddDatasetUseCase } from '$lib/server/application/use_cases/groups/update'
import { err, ok } from '$lib/server/entities/errors'
import { getDatasetModule } from '$lib/server/modules/datasets'
import { getGroupsRepositoryModule, getGroupsServiceModule } from '$lib/server/modules/groups'

export const datasetCreateController = async ({
	data,
	session,
	configuration
}: {
	data: unknown
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errs, dataset] = await datasetCreateUseCase({
		data,
		dataset_service: getDatasetModule(),
		group_repository: getGroupsRepositoryModule(),
		group_service: getGroupsServiceModule(),
		...getServerContext({ session, configuration })
	})
	if (errs !== null) {
		return err(errs)
	}
	const [g_errs] = await groupAddDatasetUseCase({
		dataset_id: dataset.id,
		group_id: dataset.groups[0].id,
		groups_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
	if (g_errs !== null) {
		return err(g_errs)
	}
	return ok(dataset)
}

import { datasetCreateUseCase } from '$lib/server/application/use_cases/datasets/create'
import { groupAddDatasetUseCase } from '$lib/server/application/use_cases/groups/update'
import { err, ok } from '$lib/server/entities/errors'
import { getDatasetModule } from '$lib/server/modules/datasets'
import { getGroupsRepositoryModule, getGroupsServiceModule } from '$lib/server/modules/groups'

export const datasetCreateController = async ({
	data,
	session
}: {
	data: unknown
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errs, dataset] = await datasetCreateUseCase({
		data,
		dataset_service: getDatasetModule(),
		group_repository: getGroupsRepositoryModule(),
		group_service: getGroupsServiceModule(),
		session
	})
	if (errs !== null) {
		return err(errs)
	}
	const [g_errs] = await groupAddDatasetUseCase({
		dataset_id: dataset.id,
		group_id: dataset.groups[0].id,
		session,
		groups_repository: getGroupsRepositoryModule()
	})
	if (g_errs !== null) {
		return err(g_errs)
	}
	return ok(dataset)
}

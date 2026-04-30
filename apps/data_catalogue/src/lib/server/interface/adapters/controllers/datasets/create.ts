import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { datasetCreateUseCase } from '$lib/server/application/use_cases/datasets/create'
import { err, ok } from '$lib/server/entities/errors'
import { getDatasetModule } from '$lib/server/modules/datasets'
import { getGroupsServiceModule } from '$lib/server/modules/groups'
import { log } from '$lib/utils/server/logger'

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
		group_service: getGroupsServiceModule(),
		...getServerContext({ session, configuration })
	})
	if (errs !== null) {
		log.error({ message: 'datasetCreateController', errs })
		return err(errs)
	}

	return ok(dataset)
}

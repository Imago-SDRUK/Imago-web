import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { datasetDeleteUseCase } from '$lib/server/application/use_cases/datasets/delete'
import { err } from '$lib/server/entities/errors'
import { getDatasetModule } from '$lib/server/modules/datasets'

export const datasetDeleteController = async ({
	id,
	session,
	configuration
}: {
	id?: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: `You need to provide an id`, id: 'no-id' })
	}
	return await datasetDeleteUseCase({
		id,
		dataset_service: getDatasetModule(),
		...getServerContext({ session, configuration })
	})
}

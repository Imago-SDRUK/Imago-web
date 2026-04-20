import { datasetDeleteUseCase } from '$lib/server/application/use_cases/datasets/delete'
import { err } from '$lib/server/entities/errors'
import { getDatasetModule } from '$lib/server/modules/datasets'

export const datasetDeleteController = async ({
	id,
	session
}: {
	id?: string
	session: App.Locals['session']
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
		session
	})
}

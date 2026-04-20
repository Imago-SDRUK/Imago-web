import { getDownloadsModule } from '$lib/server/modules/downloads'
import { err } from '$lib/server/entities/errors'
import { downloadsGetByDatasetUseCase } from '$lib/server/application/use_cases/downloads/get'
import { getDatasetModule } from '$lib/server/modules/datasets'

export const donwloadsGetByDatasetController = async ({
	id,
	session
}: {
	id: string
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Missing ID' })
	}
	return await downloadsGetByDatasetUseCase({
		id,
		session,
		downloads_repository: getDownloadsModule(),
		dataset_service: getDatasetModule()
	})
}

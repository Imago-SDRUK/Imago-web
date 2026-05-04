import { getServerContext } from '$lib/server/application/context'
import { downloadsGetByDatasetUseCase } from '$lib/server/application/use_cases/downloads/get'
import { err } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getDatasetModule } from '$lib/server/modules/datasets'
import { getDownloadsModule } from '$lib/server/modules/downloads'

export const donwloadsGetByDatasetController = async ({
	id,
	session,
	configuration
}: {
	id: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Missing ID' })
	}
	return await downloadsGetByDatasetUseCase({
		id,
		downloads_repository: getDownloadsModule(),
		dataset_service: getDatasetModule(),
		...getServerContext({ session, configuration })
	})
}

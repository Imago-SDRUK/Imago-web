import { getServerContext } from '$lib/server/application/context'
import { downloadsCreateUseCase } from '$lib/server/application/use_cases/downloads/create'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getDownloadsModule } from '$lib/server/modules/downloads'
import { getResourceRepositoryModule } from '$lib/server/modules/resources'

export const downloadCreateController = async ({
	resource_id,
	version_id,
	session,
	configuration
}: {
	version_id: string
	resource_id: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [download_errors, download] = await downloadsCreateUseCase({
		resource_id,
		version_id,
		downloads_repository: getDownloadsModule(),
		resource_repository: getResourceRepositoryModule(),
		...getServerContext({ session, configuration })
	})
	if (download_errors !== null) {
		return err(download_errors)
	}
	return ok(download)
}

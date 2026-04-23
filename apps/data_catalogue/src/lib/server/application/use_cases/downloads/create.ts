import type { AppContext } from '$lib/server/application/context'
import type { DownloadsRepository } from '$lib/server/application/repositories/downloads'
import { err, ok } from '$lib/server/entities/errors'
import type { DownloadRequest } from '$lib/server/entities/models/downloads'

// NOTE: maybe make this a sub use case instead?
export const downloadsCreateUseCase = async ({
	data,
	session,
	downloads_repository,
	configuration,
	authorisation_module
}: {
	data: DownloadRequest
	downloads_repository: DownloadsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Resource',
		object: data.resource,
		permits: 'read',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [d_errors, download] = await downloads_repository.registerDownload({ data })
	if (d_errors !== null) {
		return err(d_errors)
	}
	return ok(download)
}

import type { DownloadsRepository } from '$lib/server/application/repositories/downloads'
import { err, ok } from '$lib/server/entities/errors'
import type { DownloadRequest } from '$lib/server/entities/models/downloads'
import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const downloadsCreateUseCase = async ({
	data,
	session,
	downloads_repository
}: {
	data: DownloadRequest
	session: Session
	downloads_repository: DownloadsRepository
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'questions',
		permits: 'read'
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

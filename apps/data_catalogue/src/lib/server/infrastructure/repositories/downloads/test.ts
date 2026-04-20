import type { DownloadsRepository } from '$lib/server/application/repositories/downloads'
import { ok } from '$lib/server/entities/errors'
import { DateTime } from 'luxon'

const registerDownload: DownloadsRepository['registerDownload'] = async () => {
	return ok({
		created_at: DateTime.now().toJSDate(),
		resource: '',
		user: '',
		version: ''
	})
}

export const downloadsRepositoryInfrastructureTest: DownloadsRepository = {
	registerDownload
}

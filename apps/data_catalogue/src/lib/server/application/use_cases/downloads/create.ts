import type { AppContext } from '$lib/server/application/context'
import type { DownloadsRepository } from '$lib/server/application/repositories/downloads'
import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import { err, ok } from '$lib/server/entities/errors'
import { downloads } from '$lib/server/entities/models/downloads'
import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'

// NOTE: maybe make this a sub use case instead?
export const downloadsCreateUseCase = async ({
	session,
	downloads_repository,
	configuration,
	authorisation_module,
	version_id,
	resource_id,
	resource_repository
}: {
	version_id: string
	resource_id: string
	downloads_repository: DownloadsRepository
	resource_repository: ResourceRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'ResourceVersion',
		object: version_id,
		permits: 'read',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(downloads)
	const validated = schema({
		version: version_id,
		resource: resource_id,
		user: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Unauthorised', message: validated.summary })
	}
	const [d_errors, download] = await downloads_repository.registerDownload({ data: validated })
	if (d_errors !== null) {
		return err(d_errors)
	}
	const [v_errors] = await resource_repository.updateVersionAddDownload({ id: version_id })
	if (v_errors !== null) {
		return err(v_errors)
	}
	return ok(download)
}

import type { DownloadsRepository } from '$lib/server/application/repositories/downloads'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import type { DatasetService } from '$lib/server/application/services/dataset'
import type { Resource } from '$lib/server/entities/models/datasets'
import type { AuthorisationService } from '$lib/server/application/services/autorisation'
import type { AppContext } from '$lib/server/application/context'

export const downloadsGetByDatasetUseCase = async ({
	id,
	session,
	dataset_service,
	downloads_repository,
	authorisation_module,
	configuration
}: {
	id: string
	dataset_service: DatasetService
	downloads_repository: DownloadsRepository
	authorisation_module: AuthorisationService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Resource',
		object: id,
		permits: 'read',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [d_errors, dataset] = await dataset_service.getDataset({ id })
	if (d_errors !== null) {
		return err(d_errors)
	}
	if (dataset === null) {
		return err({ reason: 'Not Found' })
	}
	const downloads = await Promise.all(
		dataset?.resources.map((resource) =>
			downloads_repository.getDownloadsCount({ id: resource.id }).then(([errors, count]) => {
				if (errors !== null) {
					return err(errors)
				}
				return ok({
					...resource,
					downloads: count
				})
			})
		)
	)
	const parsed = downloads.reduce(
		(acc, [errors, resource]) => {
			if (errors !== null) {
				acc.errors.push(errors)
			}
			if (resource !== null) {
				acc.downloads.push(resource)
			}
			return acc
		},
		{ errors: [], downloads: [] } as {
			errors: ErrTypes[]
			downloads: (Resource & { downloads: number })[]
		}
	)
	if (parsed.errors.length > 0) {
		return err(parsed.errors[0])
	}
	return ok(parsed.downloads)
}

import type { IDownloadsRepository } from '$lib/server/application/repositories/downloads'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import type { IDatasetService } from '$lib/server/application/services/dataset'
import type { IAuthorisationService } from '$lib/server/application/services/autorisation'
import type { AppContext } from '$lib/server/application/context'
import { DateTime } from 'luxon'
import type { IResourceRepository } from '$lib/server/application/repositories/resource'
import type { Resource } from '$lib/server/entities/models/resources'

export const downloadsGetByDatasetUseCase = async ({
	id,
	session,
	dataset_service,
	downloads_repository,
	authorisation_module,
	configuration
}: {
	id: string
	dataset_service: IDatasetService
	downloads_repository: IDownloadsRepository
	authorisation_module: IAuthorisationService
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

export const dowloadsGetAggregatesUseCase = async ({
	from,
	to,
	downloads_repository,
	resource_repository,
	authorisation_module,
	session,
	configuration
}: {
	from: string
	to: string
	downloads_repository: IDownloadsRepository
	authorisation_module: IAuthorisationService
	resource_repository: IResourceRepository
} & AppContext) => {
	const [permission_errors, permission] = await authorisation_module.authorise({
		namespace: 'Application',
		object: 'dashboard',
		permits: 'read',
		actor: session.identity.id,
		configuration
	})

	if (permission_errors) {
		return err(permission_errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const _to = getDate(to)
	const _from = getDate(from)
	const [downloads_error, downloads] = await downloads_repository.getDownloadsAggregate({
		to: _to,
		from: _from
	})
	if (downloads_error !== null) {
		return err(downloads_error)
	}
	const enriched = await Promise.all(
		downloads.map((download) =>
			resource_repository.getResource({ id: download.resource_id }).then(([errors, resource]) => {
				if (errors !== null) {
					return err(errors)
				}
				return ok({ ...resource, downloads: download.count })
			})
		)
	)
	const result = enriched.reduce(
		(acc, [errors, data]) => {
			if (errors === null) {
				acc.push(data)
			}
			return acc
		},
		[] as (Resource & { downloads: number })[]
	)
	return ok(result)
}

const getDate = (str: string) => {
	try {
		const value = DateTime.fromISO(str).toJSDate()
		if (isNaN(value.getTime())) {
			return DateTime.now().toJSDate()
		}
		return value
	} catch {
		return DateTime.now().toJSDate()
	}
}

//insights dashboard
export const downloadsGetDashboardUseCase = async ({
	downloads_repository,
	authorisation_module,
	session,
	configuration
}: {
	downloads_repository: IDownloadsRepository
	authorisation_module: IAuthorisationService
} & AppContext) => {
	const [permission_errors, permission] = await authorisation_module.authorise({
		namespace: 'Application',
		object: 'dashboard',
		permits: 'read',
		actor: session.identity.id,
		configuration
	})

	if (permission_errors) {
		return err(permission_errors)
	}

	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [total_errors, totalDownloads] =
		await downloads_repository.getTotalDownloads()

	if (total_errors !== null) {
		return err(total_errors)
	}

	const [top_errors, topDownloadedResources] =
		await downloads_repository.getTopDownloadedResources()

	if (top_errors !== null) {
		return err(top_errors)
	}

	return ok({
		totalDownloads,
		topDownloadedResources
	})
}


// const reduceAggregates = <T>(
// 	acc: { errors: ErrTypes[]; data: T[] },
// 	el: [ErrTypes, null] | [null, T]
// ) => {
// 	if (el[0] !== null) {
// 		acc.errors.push(el[0])
// 		return acc
// 	}
// 	acc.data.push(el[1])
// 	return acc
// }

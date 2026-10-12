import type { IResourceRepository } from '$lib/server/application/repositories/resource'
import type { IDatastoreService } from '$lib/server/application/services/datastore'
import type { IResourceService } from '$lib/server/application/services/resource'
import type { AppContext } from '$lib/server/application/context'
import type { IStoragesRepository } from '$lib/server/application/repositories/storages'
import type { IDownloadsRepository } from '$lib/server/application/repositories/downloads'
import type { IStorageResolver } from '$lib/server/application/resolvers/storage'
import { err, ok } from '$lib/server/entities/errors'
import { datastoreToCsvw } from '$lib/server/entities/utils/datastore'
import { createInsertSchema } from 'drizzle-arktype'
import { downloads } from '$lib/db/schema'
import { type } from 'arktype'
import { log } from '$lib/utils/server/logger'
import { handleArkErrors } from '$lib/db/validation'

export const resourceGetUseCase = async ({
	id,
	resource_respository,
	resource_service,
	datastore_service,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	resource_respository: IResourceRepository
	resource_service: IResourceService
	datastore_service: IDatastoreService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Resource',
		object: id,
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
	const [errs, resource_metadata] = await resource_service.getResource({ id })
	if (errs !== null) {
		return err(errs)
	}
	const [[resource_errors, resource], [versions_errors, versions]] = await Promise.all([
		resource_respository.getResource({ id }),
		resource_respository.getResourceVersions({ id })
	])
	if (resource_errors !== null) {
		return err(resource_errors)
	}
	if (versions_errors !== null) {
		return err(versions_errors)
	}

	const transformed = versions.map((version) => ({
		...version,
		url: `/api/v1/resources/${resource.id}?version=${version.id}`
	}))
	if (resource_metadata.datastore_active) {
		const [datastore_errors, datastore] = await datastore_service.getStructuralMetadata({ id })
		if (datastore_errors !== null) {
			return err(datastore_errors)
		}
		const converted = datastoreToCsvw(datastore)
		return ok({
			...resource_metadata,
			resource: resource,
			versions: transformed,
			metadata: converted
		})
	}

	return ok({
		...resource_metadata,
		resource: resource,
		versions: transformed,
		metadata: null
	})
}

export const resourceVersionGetDownloadUrlUseCase = async ({
	resource_id,
	version_id,
	session,
	configuration,
	authorisation_module,
	resource_repository,
	downloads_repository,
	storage_repository,
	storage_resolver
}: {
	resource_id: string
	version_id: string
	resource_repository: IResourceRepository
	storage_repository: IStoragesRepository
	storage_resolver: IStorageResolver
	downloads_repository: IDownloadsRepository
} & AppContext) => {
	if (session.identity.id === 'anonymous') {
		return err({ reason: 'Unauthorised' })
	}
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
		return err({
			reason: 'Invalid Data',
			errors: handleArkErrors(validated),
			message: validated.summary,
			id: 'invalid-data'
		})
	}
	const [version_errors, version] = await resource_repository.getResourceVersion({
		resource: validated.resource,
		version: version_id
	})
	if (version_errors !== null) {
		return err(version_errors)
	}
	const [storage_service_error, storage_service] = await storage_resolver.resolve({
		id: configuration.resources_storage ?? '',
		storages_repository: storage_repository
	})
	if (storage_service_error !== null) {
		return err(storage_service_error)
	}
	const [errors_s, url] = await storage_service.getDownloadUrl({
		filename: version.id
	})
	if (errors_s !== null) {
		return err(errors_s)
	}

	const [d_errors] = await downloads_repository.registerDownload({ data: validated })
	if (d_errors !== null) {
		log.error({ message: 'Error registering download' })
	}
	const [v_errors] = await resource_repository.updateVersionAddDownload({ id: version_id })
	if (v_errors !== null) {
		log.error({ message: 'Error updating the version download count' })
	}
	return ok(url)
}

export const resourcesGetUseCase = async ({
	id,
	resource_respository,
	resource_service,
	datastore_service,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	resource_respository: IResourceRepository
	resource_service: IResourceService
	datastore_service: IDatastoreService
} & AppContext) => {
	// if (session.identity.id === 'anonymous') {
	// 	return err({ reason: 'Unauthenticated' })
	// }
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Resource',
		object: id,
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
	const [errs, resource_metadata] = await resource_service.getResource({ id })
	if (errs !== null) {
		return err(errs)
	}
	if (resource_metadata.datastore_active) {
		const [resource, versions, datastore] = await Promise.all([
			resource_respository.getResource({ id }),
			resource_respository.getResourceVersions({ id }),
			datastore_service.getStructuralMetadata({ id })
		])
		if (resource[0] === null && versions[0] === null && datastore[0] === null) {
			return ok({
				...resource_metadata,
				resource_respository: resource[1],
				versions: versions[1],
				structural_metadata: datastore[1]
			})
		}
		if (resource[0] !== null) {
			return err(resource[0])
		}
		if (versions[0] !== null) {
			return err(versions[0])
		}
		if (datastore[0] !== null) {
			return err(datastore[0])
		}
		return err({ reason: 'Unexpected', error: { resource, versions, datastore } })
	}
	const [resource, versions] = await Promise.all([
		resource_respository.getResource({ id }),
		resource_respository.getResourceVersions({ id })
	])

	if (resource[0] === null && versions[0] === null) {
		return ok({
			...resource_metadata,
			resource_respository: resource[1],
			versions: versions[1],
			structural_metadata: null
		})
	}
	if (resource[0] !== null) {
		return err(resource[0])
	}
	if (versions[0] !== null) {
		return err(versions[0])
	}
	return err({ reason: 'Unexpected', error: { resource, versions } })
}

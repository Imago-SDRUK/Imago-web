import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import type { DatastoreService } from '$lib/server/application/services/datastore'
import type { ResourceService } from '$lib/server/application/services/resource'
import type { StorageService } from '$lib/server/application/services/storage'
import { err, ok } from '$lib/server/entities/errors'
import type { AppContext } from '$lib/server/application/context'
import { datastoreToCsvw } from '$lib/server/entities/utils/datastore'

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
	resource_respository: ResourceRepository
	resource_service: ResourceService
	datastore_service: DatastoreService
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
			const converted = datastoreToCsvw(datastore[1])
			return ok({
				...resource_metadata,
				resource: resource[1],
				versions: versions[1],
				metadata: converted
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
		return err({ reason: 'Unexpected', error: 'Error getting the resource' })
	}
	const [resource, versions] = await Promise.all([
		resource_respository.getResource({ id }),
		resource_respository.getResourceVersions({ id })
	])

	if (resource[0] === null && versions[0] === null) {
		return ok({
			...resource_metadata,
			resource: resource[1],
			versions: versions[1],
			metadata: null
		})
	}
	if (resource[0] !== null) {
		return err(resource[0])
	}
	if (versions[0] !== null) {
		return err(versions[0])
	}
	return err({ reason: 'Unexpected', error: 'Error getting the resource' })
}

export const resourceVersionGetDownloadUrlUseCase = async ({
	resource_id,
	version_id,
	storage_service,
	session,
	configuration,
	authorisation_module,
	resource_respository
}: {
	resource_id: string
	version_id: string
	resource_respository: ResourceRepository
	storage_service: StorageService
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
	const [version_errors, version] = await resource_respository.getResourceVersion({
		resource: resource_id,
		version: version_id
	})
	if (version_errors !== null) {
		return err(version_errors)
	}
	const [errors_s, url] = await storage_service.getDownloadUrl({ filename: version.id })
	if (errors_s !== null) {
		return err(errors_s)
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
	resource_respository: ResourceRepository
	resource_service: ResourceService
	datastore_service: DatastoreService
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

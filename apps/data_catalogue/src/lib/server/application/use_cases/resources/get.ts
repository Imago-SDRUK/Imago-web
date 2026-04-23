import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import type { DatastoreService } from '$lib/server/application/services/datastore'
import type { ResourceService } from '$lib/server/application/services/resource'
import type { StorageService } from '$lib/server/application/services/storage'
import type { Session } from '$lib/server/entities/models/identity'
import { err, ok } from '$lib/server/entities/errors'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import type { AppContext } from '$lib/server/application/context'

export const resourceGetUseCase = async ({
	id,
	resource_respository,
	resource_service,
	datastore_service,
	session
}: {
	id: string
	resource_respository: ResourceRepository
	resource_service: ResourceService
	datastore_service: DatastoreService
	session: Session
}) => {
	if (session.identity.id === 'anonymous') {
		return err({ reason: 'Unauthorised' })
	}
	const [errors, permission] = await getAuthorisationModule().authorise({
		namespace: 'Resource',
		object: id,
		permits: 'read',
		actor: session.identity.id
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, resource_metadata] = await resource_service
		.getResource({ id })
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errs !== null) {
		return err(errs)
	}
	if (resource_metadata.datastore_active) {
		const [resource, versions, datastore] = await Promise.all([
			resource_respository.getResource({ id }),
			resource_respository.getResourceVersions({ id }),
			datastore_service.getStructuralMetadata({ id })
		])
		return ok({
			...resource_metadata,
			resource_respository: resource,
			versions,
			structural_metadata: datastore
		})
	}
	const [resource, versions] = await Promise.all([
		resource_respository
			.getResource({ id })
			.then((res) => ok(res))
			.catch((_err) => err({ reason: 'Unexpected', error: _err })),
		resource_respository
			.getResourceVersions({ id })
			.then((res) => ok(res))
			.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	])
	if (resource[0] !== null) {
		return err(resource[0])
	}
	if (versions[0] !== null) {
		return err(versions[0])
	}
	return ok({
		...resource_metadata,
		resource_respository: resource[1],
		versions: versions[1],
		structural_metadata: null
	})
}

export const resourceVersionGetDownloadUrlUseCase = async ({
	version_id,
	storage_service,
	session,
	configuration,
	authorisation_module
}: {
	id: string
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
	const [errors_s, url] = await storage_service
		.getDownloadUrl({ filename: version_id })
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errors_s !== null) {
		return err(errors_s)
	}
	return ok(url)
}

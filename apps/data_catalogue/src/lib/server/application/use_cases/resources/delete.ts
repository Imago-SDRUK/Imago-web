import type { IResourceRepository } from '$lib/server/application/repositories/resource'
import type { IDatastoreService } from '$lib/server/application/services/datastore'
import type { IResourceService } from '$lib/server/application/services/resource'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import type { AppContext } from '$lib/server/application/context'
import type { IStorageResolver } from '$lib/server/application/resolvers/storage'
import type { IStoragesRepository } from '$lib/server/application/repositories/storages'

export const resourceDeleteUseCase = async ({
	id,
	resource_respository,
	storage_repository,
	session,
	configuration,
	authorisation_module,
	storage_resolver
}: {
	id: string
	resource_respository: IResourceRepository
	datastore_service: IDatastoreService
	storage_resolver: IStorageResolver
	storage_repository: IStoragesRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Resource',
		object: id,
		permits: 'delete',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [v_errors, versions] = await resource_respository.getResourceVersions({ id })
	if (v_errors !== null) {
		return err(v_errors)
	}
	const [storage_service_error, storage_service] = await storage_resolver.resolve({
		id: configuration.resources_storage ?? '',
		storages_repository: storage_repository
	})
	if (storage_service_error !== null) {
		return err(storage_service_error)
	}
	const deleted = await Promise.all(
		versions.map(({ id }) => storage_service.deleteFile({ filename: id }))
	)
	const { st_errors } = deleted.reduce(
		(acc, [errors, result]) => {
			if (errors !== null) {
				acc.st_errors.push(errors)
				return acc
			}
			acc.st_deleted.push(result)
			return acc
		},
		{ st_errors: [], st_deleted: [] } as { st_errors: ErrTypes[]; st_deleted: boolean[] }
	)
	if (st_errors.length > 0) {
		return err(st_errors[0])
	}
	const [rr_errors] = await resource_respository.deleteResource({ id })
	if (rr_errors !== null) {
		return err(rr_errors)
	}
	const [d_errs] = await authorisation_module.deletePermission({
		namespace: 'Resource',
		object: id
	})
	if (d_errs !== null) {
		return err(d_errs)
	}
	return ok(null)
}

export const resourceServiceDeleteUseCase = async ({
	id,
	resource_service,
	datastore_service,
	session,
	configuration,
	authorisation_module,
	rollback
}: {
	id: string
	resource_service: IResourceService
	datastore_service: IDatastoreService
	rollback?: boolean
} & AppContext) => {
	if (!rollback) {
		const [errors, permission] = await authorisation_module.authorise({
			namespace: 'Resource',
			object: id,
			permits: 'delete',
			actor: session.identity.id,
			configuration
		})
		if (errors) {
			return err(errors)
		}
		if (!permission.allowed) {
			return err({ reason: 'Unauthorised' })
		}
	}

	const [r_errors, resource] = await resource_service.getResource({ id })
	if (r_errors !== null) {
		return err(r_errors)
	}
	if (resource?.datastore_active) {
		const [ds_errors] = await datastore_service.deleteStructuralMetadata({ id })
		if (ds_errors !== null) {
			return err(ds_errors)
		}
	}
	const [rs_errors] = await resource_service.deleteResource({ id })
	if (rs_errors !== null) {
		return err(rs_errors)
	}
	return ok(null)
}

export const resourceVersionDeleteUseCase = async ({
	version_id,
	resource_respository,
	session,
	authorisation_module,
	configuration,
	storage_repository,
	storage_resolver
}: {
	version_id: string
	resource_respository: IResourceRepository
	storage_repository: IStoragesRepository
	storage_resolver: IStorageResolver
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'ResourceVersion',
		object: version_id,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	if (!version_id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an ID', id: 'no-id' })
	}
	const [errs] = await resource_respository.deleteResourceVersion({
		id: version_id
	})
	if (errs !== null) {
		return err(errs)
	}

	const [storage_service_error, storage_service] = await storage_resolver.resolve({
		id: configuration.resources_storage ?? '',
		storages_repository: storage_repository
	})
	if (storage_service_error !== null) {
		return err(storage_service_error)
	}
	const [storage_errors, storage] = await storage_service.deleteFile({
		filename: version_id
	})
	if (storage_errors !== null) {
		return err(storage_errors)
	}
	return ok(storage)
}

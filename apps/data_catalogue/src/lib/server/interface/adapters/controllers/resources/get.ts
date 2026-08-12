import {
	resourceGetUseCase,
	resourceVersionGetDownloadUrlUseCase
} from '$lib/server/application/use_cases/resources/get'
import { getDatastoreModule } from '$lib/server/modules/datastore'
import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import { getResourceServiceModule } from '$lib/server/modules/resources_service'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { log } from '$lib/utils/server/logger'
import { getStorageServiceModule } from '$lib/server/modules/storage_service'
import { getDownloadsModule } from '$lib/server/modules/downloads'
import { storageGetCredentialsAndTypeUseCase } from '$lib/server/application/use_cases/storages/get'
import { getStorageRepositoryModule } from '$lib/server/modules/storage'

export const resourceGetController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	id: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, resource] = await resourceGetUseCase({
		id,
		datastore_service: getDatastoreModule(),
		resource_respository: getResourceRepositoryModule(),
		resource_service: getResourceServiceModule(),
		...getServerContext({ session, configuration })
	})
	if (errors) {
		log.error({ controller: 'resourceGetController', errors })
		return err(errors)
	}
	// TODO: this should be moved outside of the application/controller
	const versions = resource.versions.map((version) => ({
		...version,
		url: `/api/v1/resources/${resource.id}?version=${version.id}`
	}))
	return ok({ ...resource, versions })
}

export const resourcesGetController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	id: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, resource] = await resourceGetUseCase({
		id,
		datastore_service: getDatastoreModule(),
		resource_respository: getResourceRepositoryModule(),
		resource_service: getResourceServiceModule(),
		...getServerContext({ session, configuration })
	})
	if (errors) {
		log.error({ controller: 'resourceGetController', errors })
		return err(errors)
	}
	return ok(resource)
}

export const resourceVersionDownloadController = async ({
	session,
	resource_id,
	version_id,
	configuration
}: {
	session: App.Locals['session']
	resource_id: string
	version_id: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [storage_errors, storage_type] = await storageGetCredentialsAndTypeUseCase({
		storages_repository: getStorageRepositoryModule(),
		id: configuration.resources_storage,
		...getServerContext({ session, configuration })
	})
	if (storage_errors !== null) {
		return err(storage_errors)
	}
	const [errors, resource] = await resourceVersionGetDownloadUrlUseCase({
		version_id,
		resource_id,
		resource_repository: getResourceRepositoryModule(),
		downloads_repository: getDownloadsModule(),
		storage_service: getStorageServiceModule(storage_type.type),
		storage_credentials: storage_type.credentials,
		...getServerContext({ session, configuration })
	})
	if (errors) {
		log.error({ controller: 'resourceVersionDownloadController', errors })
		return err(errors)
	}
	return ok(resource)
}

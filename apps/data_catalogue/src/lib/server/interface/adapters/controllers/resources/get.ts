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
import { getDownloadsModule } from '$lib/server/modules/downloads'
import { getStorageRepositoryModule } from '$lib/server/modules/storage'
import { getStorageResolverModule } from '$lib/server/application/resolvers/storage'

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
	const [errors, resource] = await resourceVersionGetDownloadUrlUseCase({
		version_id,
		resource_id,
		resource_repository: getResourceRepositoryModule(),
		downloads_repository: getDownloadsModule(),
		storage_repository: getStorageRepositoryModule(),
		storage_resolver: getStorageResolverModule(),
		...getServerContext({ session, configuration })
	})
	if (errors) {
		log.error({ controller: 'resourceVersionDownloadController', errors })
		return err(errors)
	}
	return ok(resource)
}

import type { Configuration } from '$lib/server/entities/models/configuration'
import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import { getResourceServiceModule } from '$lib/server/modules/resources_service'
import { err, ok } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import { log } from '$lib/utils/server/logger'
import {
	resourceDeleteUseCase,
	resourceServiceDeleteUseCase,
	resourceVersionDeleteUseCase
} from '$lib/server/application/use_cases/resources/delete'
import { getDatastoreModule } from '$lib/server/modules/datastore'
import { getStorageServiceModule } from '$lib/server/modules/storage_service'
import { storageGetCredentialsAndTypeUseCase } from '$lib/server/application/use_cases/storages/get'
import { getStorageRepositoryModule } from '$lib/server/modules/storage'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const resourceDeleteController = async ({
	session,
	resource_id,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	resource_id?: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!resource_id) {
		return err({
			reason: 'Invalid Data',
			message: 'You need to provide a resource ID',
			id: 'no-id'
		})
	}
	const [storage_errors, storage_type] = await storageGetCredentialsAndTypeUseCase({
		storages_repository: getStorageRepositoryModule(),
		id: configuration.resources_storage,
		...getServerContext({ session, configuration })
	})
	if (storage_errors !== null) {
		return err(storage_errors)
	}
	const [s_errors] = await resourceServiceDeleteUseCase({
		id: resource_id,
		resource_service: getResourceServiceModule(),
		datastore_service: getDatastoreModule(),
		...getServerContext({ session, configuration })
	})
	if (s_errors !== null) {
		return err(s_errors)
	}
	const [errors, res] = await resourceDeleteUseCase({
		id: resource_id,
		resource_respository: getResourceRepositoryModule(),
		datastore_service: getDatastoreModule(),
		storage_service: getStorageServiceModule(storage_type.type),
		storage_credentials: storage_type.credentials,
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		log.error({ caller: 'resourceCreateController', errors })
		return err(errors)
	}
	return ok(res)
}

export const resourceVersionDeleteController = async ({
	session,
	version_id,
	configuration
}: {
	session: App.Locals['session']
	version_id: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}

	const [storage_errors, storage] = await storageGetCredentialsAndTypeUseCase({
		storages_repository: getStorageRepositoryModule(),
		id: configuration.resources_storage,
		...getServerContext({ session, configuration })
	})
	if (storage_errors !== null) {
		return err(storage_errors)
	}
	const upload_url = await resourceVersionDeleteUseCase({
		storage_credentials: storage.credentials,
		version_id,
		resource_respository: getResourceRepositoryModule(),
		storage_service: getStorageServiceModule(storage.type),
		...getServerContext({ session, configuration })
	})
	return upload_url
}

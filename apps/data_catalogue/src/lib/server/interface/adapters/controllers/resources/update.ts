import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import type { ResourceRequest, ResourceVersionRequest } from '$lib/server/entities/models/resources'
import {
	resourceUpdateUseCase,
	resourceVersionUpdateFileUseCase,
	resourceVersionUpdateUseCase
} from '$lib/server/application/use_cases/resources/update'
import { resourceVersionCreateUseCase } from '$lib/server/application/use_cases/resources/create'
import { getStorageModule } from '$lib/server/modules/storage'
import { err } from '$lib/server/entities/errors'
import type { configuration, Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const resourceUpdateController = async ({
	session,
	id,
	data,
	configuration
}: {
	session: App.Locals['session']
	id: string
	data: Partial<ResourceRequest>
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	return await resourceUpdateUseCase({
		resource_id: id,
		resource_respository: getResourceRepositoryModule(),
		data,
		...getServerContext({ session, configuration })
	})
	// return resource
	// return presenter({ resource })
}

export const resourceAddVersionController = async ({
	session,
	id,
	version,
	configuration
}: {
	version: string
	session: App.Locals['session']
	id: string
	data: Partial<ResourceRequest>
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	return await resourceVersionCreateUseCase({
		resource_id: id,
		resource_respository: getResourceRepositoryModule(),
		storage_service: getStorageModule(),
		version,
		...getServerContext({ session, configuration })
	})
	// return upload_url
	// return presenter({ resource })
}

export const resourceUpdateVersionFileController = async ({
	session,
	version_id,
	data,
	configuration
}: {
	session: App.Locals['session']
	version_id: string
	data: Partial<ResourceVersionRequest>
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const upload_url = await resourceVersionUpdateFileUseCase({
		version_id,
		data,
		resource_respository: getResourceRepositoryModule(),
		...getServerContext({ session, configuration })
	})
	return upload_url
}

export const resourceUpdateVersionController = async ({
	session,
	version_id,
	data,
	configuration
}: {
	session: App.Locals['session']
	version_id: string
	data: Partial<ResourceVersionRequest>
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const upload_url = await resourceVersionUpdateUseCase({
		version_id,
		data,
		resource_respository: getResourceRepositoryModule(),
		...getServerContext({ session, configuration })
	})
	return upload_url
}

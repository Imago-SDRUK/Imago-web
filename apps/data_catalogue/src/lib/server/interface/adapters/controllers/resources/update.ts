import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import type {
	ResourceRequest,
	ResourceServiceRequest,
	ResourceVersionRequest
} from '$lib/server/entities/models/resources'
import {
	resourceServiceUpdateUseCase,
	resourceUpdateUseCase,
	resourceVersionUpdateFileUseCase,
	resourceVersionUpdateUseCase
} from '$lib/server/application/use_cases/resources/update'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { resourceVersionCreateUseCase } from '$lib/server/application/use_cases/resources/create'
import { err, ok } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import { log } from '$lib/utils/server/logger'
import { getResourceServiceModule } from '$lib/server/modules/resources_service'
import { getStorageRepositoryModule } from '$lib/server/modules/storage'
import { getStorageResolverModule } from '$lib/server/application/resolvers/storage'

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
	configuration,
	data
}: {
	session: App.Locals['session']
	data: Partial<ResourceVersionRequest>
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, res] = await resourceVersionCreateUseCase({
		data,
		resource_respository: getResourceRepositoryModule(),
		storage_repository: getStorageRepositoryModule(),
		storage_resolver: getStorageResolverModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		log.error({ controller: 'resourceAddVersionController' })
		return err(errors)
	}
	return ok(res)
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

export const resourceVersionUpdateController = async ({
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

export const resourceServiceUpdateController = async ({
	session,
	id,
	data,
	configuration
}: {
	session: App.Locals['session']
	id: string
	data: Partial<ResourceServiceRequest>
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const result = await resourceServiceUpdateUseCase({
		id,
		data,
		resource_service: getResourceServiceModule(),
		...getServerContext({ session, configuration })
	})
	return result
}

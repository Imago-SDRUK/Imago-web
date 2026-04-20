import { error } from '@sveltejs/kit'
import { SERVER_ERRORS } from '$lib/globals/server'
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

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const resourceUpdateController = async ({
	session,
	id,
	data
}: {
	session: App.Locals['session']
	id: string
	data: Partial<ResourceRequest>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	return await resourceUpdateUseCase({
		session,
		resource_id: id,
		resource_respository: getResourceRepositoryModule(),
		data
	})
	// return resource
	// return presenter({ resource })
}

export const resourceAddVersionController = async ({
	session,
	id,
	version
}: {
	version: string
	session: App.Locals['session']
	id: string
	data: Partial<ResourceRequest>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	return await resourceVersionCreateUseCase({
		session,
		resource_id: id,
		resource_respository: getResourceRepositoryModule(),
		storage_service: getStorageModule(),
		version
	})
	// return upload_url
	// return presenter({ resource })
}

export const resourceUpdateVersionFileController = async ({
	session,
	version_id,
	data
}: {
	session: App.Locals['session']
	version_id: string
	data: Partial<ResourceVersionRequest>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const upload_url = await resourceVersionUpdateFileUseCase({
		session,
		version_id,
		data,
		resource_respository: getResourceRepositoryModule()
	})
	return upload_url
}

export const resourceUpdateVersionController = async ({
	session,
	version_id,
	data
}: {
	session: App.Locals['session']
	version_id: string
	data: Partial<ResourceVersionRequest>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const upload_url = await resourceVersionUpdateUseCase({
		session,
		version_id,
		data,
		resource_respository: getResourceRepositoryModule()
	})
	return upload_url
}

import type { DatasetRequest } from '$lib/server/entities/models/datasets'
import type { Session } from '$lib/server/entities/models/identity'
import { getDatasetModule } from '$lib/server/modules/datasets'
import {
	datasetAddGroupUseCase,
	datasetRemoveGroupUseCase,
	datasetUpdateUseCase
} from '$lib/server/application/use_cases/datasets/update'
import { err, ok } from '$lib/server/entities/errors'
import {
	datasetAddTagUseCase,
	datasetRemoveTagUseCase
} from '$lib/server/application/use_cases/datasets/update'
import { getTagsModule } from '$lib/server/modules/tags'
import { getGroupsRepositoryModule, getGroupsServiceModule } from '$lib/server/modules/groups'

export const datasetUpdateController = async ({
	id,
	session,
	data
}: {
	id?: string
	session?: Session
	data?: Partial<DatasetRequest>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id || typeof id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a dataset ID`, id: 'no-id' })
	}
	if (!data) {
		return err({
			reason: 'Invalid Data',
			message: `You need to provide some information to update`,
			id: 'no-tag'
		})
	}
	return await datasetUpdateUseCase({
		id,
		session,
		dataset_service: getDatasetModule(),
		data
	})
}

export const datasetAddTagController = async ({
	session,
	id,
	tag,
	vocabulary_id = 'general'
}: {
	id: string
	tag?: string
	vocabulary_id?: string
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id || typeof id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a dataset ID`, id: 'no-id' })
	}
	if (!tag || typeof tag !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a tag`, id: 'no-tag' })
	}
	if (!vocabulary_id || typeof vocabulary_id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a tag`, id: 'no-tag' })
	}
	return await datasetAddTagUseCase({
		id,
		tag: tag,
		vocabulary_id: vocabulary_id,
		tags_service: getTagsModule(),
		dataset_service: getDatasetModule(),
		session
	})
}

export const datasetRemoveTagController = async ({
	session,
	id,
	tag_id,
	vocabulary_id
}: {
	id?: string
	tag_id?: string
	vocabulary_id?: string
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id || typeof id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a dataset ID`, id: 'no-id' })
	}
	if (!tag_id || typeof tag_id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a tag ID`, id: 'no-tag' })
	}
	if (!vocabulary_id || typeof vocabulary_id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a tag`, id: 'no-tag' })
	}
	return await datasetRemoveTagUseCase({
		id,
		tag_id,
		vocabulary_id,
		tags_service: getTagsModule(),
		dataset_service: getDatasetModule(),
		session
	})
}

export const datasetAddGroupController = async ({
	session,
	dataset_id,
	group_id
}: {
	dataset_id?: string
	group_id?: string
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!dataset_id || typeof dataset_id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a dataset ID`, id: 'no-id' })
	}
	if (!group_id || typeof group_id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a group ID`, id: 'no-tag' })
	}

	return await datasetAddGroupUseCase({
		dataset_service: getDatasetModule(),
		groups_service: getGroupsServiceModule(),
		group_id,
		session,
		dataset_id
	})
}

export const datasetRemoveGroupController = async ({
	session,
	dataset_id,
	group_id
}: {
	dataset_id?: string
	group_id?: string
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!dataset_id || typeof dataset_id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a dataset ID`, id: 'no-id' })
	}
	if (!group_id || typeof group_id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a group ID`, id: 'no-tag' })
	}

	return await datasetRemoveGroupUseCase({
		dataset_service: getDatasetModule(),
		group_id,
		session,
		dataset_id
	})
}

import {
	datasetGetActivityPublicUseCase,
	datasetGetActivityUseCase,
	datasetGetPermissionsUseCase,
	datasetGetPublicUseCase,
	datasetGetUseCase,
	datasetsCountGetPublicUseCase,
	datasetsGetPaginatedPublicUseCase,
	datasetsGetPaginatedUseCase
} from '$lib/server/application/use_cases/datasets/get'
import { getDatasetModule } from '$lib/server/modules/datasets'
import type { Dataset } from '$lib/server/entities/models/datasets'
import { err, ok } from '$lib/server/entities/errors'
import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { getIdentityModule } from '$lib/server/modules/identity'
import { getUserModule } from '$lib/server/modules/user'

const presenter = ({ dataset }: { dataset: Dataset | null }) => dataset

export const datasetGetController = async ({
	session,
	id
}: {
	session: App.Locals['session']
	id: string
}) => {
	if (!session) {
		const [errors, dataset] = await datasetGetPublicUseCase({
			id: id,
			dataset_service: getDatasetModule()
		})
		if (errors !== null) {
			return err(errors)
		}
		return ok(presenter({ dataset }))
	}
	const [errors, dataset] = await datasetGetUseCase({
		id: id,
		dataset_service: getDatasetModule(),
		session
	})

	if (errors !== null) {
		return err(errors)
	}
	return ok(presenter({ dataset }))
}

export const datasetsGetController = async ({
	url,
	offset,
	page_size,
	search,
	session
}: {
	url: URL
	offset?: number
	page_size?: number
	search?: string
	session: App.Locals['session']
}) => {
	if (!session) {
		const [errors, datasets] = await datasetsGetPaginatedPublicUseCase({
			offset,
			page_size,
			url,
			search,
			dataset_service: getDatasetModule()
		})
		if (errors !== null) {
			return err(errors)
		}
		return ok(datasets)
	}
	const [errors, datasets] = await datasetsGetPaginatedUseCase({
		offset,
		page_size,
		url,
		search,
		dataset_service: getDatasetModule(),
		session
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(datasets)
}

// TODO: must pass through a presenter
export const datasetGetActivityController = async ({
	session,
	id,
	offset,
	page_size
}: {
	id: string
	offset?: number
	page_size?: number
	session: App.Locals['session']
}) => {
	if (!session) {
		return await datasetGetActivityPublicUseCase({
			id,
			offset,
			page_size,
			dataset_service: getDatasetModule()
		})
	}
	return await datasetGetActivityUseCase({
		id,
		offset,
		page_size,
		dataset_service: getDatasetModule(),
		session
	})
}

export const datasetsGetCountController = async () => {
	return await datasetsCountGetPublicUseCase({
		dataset_service: getDatasetModule()
	})
}

export const datasetGetPermissionsController = async ({
	session,
	id
}: {
	session: App.Locals['session']
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Unauthenticated' })
	}
	return await datasetGetPermissionsUseCase({
		session,
		id,
		groups_repository: getGroupsRepositoryModule(),
		identity_service: getIdentityModule(),
		users_repository: getUserModule()
	})
}

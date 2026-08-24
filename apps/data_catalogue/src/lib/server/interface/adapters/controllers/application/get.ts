import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import {
	applicationCheckPermissionUseCase,
	applicationGetDatasetsPaginatedUseCase,
	applicationGetGroupsUseCase,
	applicationGetQuestionsUseCase,
	applicationGetUsersUseCase
} from '$lib/server/application/use_cases/application/get'
import { err, ok } from '$lib/server/entities/errors'
import { getQuestionsModule } from '$lib/server/modules/questions'
import { log } from '$lib/utils/server/logger'
import { getUserModule } from '$lib/server/modules/user'
import { getIdentityModule } from '$lib/server/modules/identity'
import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { getDatasetModule } from '$lib/server/modules/datasets'
import type { Session } from '$lib/server/entities/models/identity'

export const applicationCheckPermissionController = async ({
	object,
	permits,
	configuration,
	session
}: {
	object?: string
	permits?: 'read' | 'manage'
	session?: Session
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, res] = await applicationCheckPermissionUseCase({
		object,
		permits,
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(res)
}

export const applicationGetQuestionsController = async ({
	limit,
	offset,
	session,
	configuration
}: {
	limit?: number
	offset?: number
	session: App.Locals['session']
	configuration: Configuration
}) => {
	log.trace({ controller: 'configurationGetController' })
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, res] = await applicationGetQuestionsUseCase({
		questions_repository: getQuestionsModule(),
		limit,
		offset,
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		log.error({ controller: 'configurationGetController', error: errors })
		return err(errors)
	}
	return ok(res)
}

export const applicationGetUsersController = async ({
	session,
	configuration,
	limit = 25,
	offset = 0
}: {
	limit: number
	offset: number
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, users] = await applicationGetUsersUseCase({
		user_repository: getUserModule(),
		identity_service: getIdentityModule(),
		limit,
		offset,
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(users)
}

export const applicationGetGroupsController = async ({
	session,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, groups] = await applicationGetGroupsUseCase({
		groups_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		log.error({ controller: 'groupsGetController', errors })
		return err(errors)
	}
	return ok(groups)
}

export const applicationGetDatasetsController = async ({
	url,
	offset,
	page_size,
	search,
	session,
	configuration
}: {
	url: URL
	offset?: number
	page_size?: number
	search?: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, datasets] = await applicationGetDatasetsPaginatedUseCase({
		offset,
		page_size,
		url,
		search,
		dataset_service: getDatasetModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		log.error({ controller: 'datasetsGetController', errors })
		return err(errors)
	}
	return ok(datasets)
}

import { err, ok } from '$lib/server/entities/errors'
import {
	groupGetPublicUseCase,
	groupGetUseCase,
	groupGetUsersUseCase,
	// groupsGetPublicUseCase,
	groupsGetUseCase
} from '$lib/server/application/use_cases/groups/get'
import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { getIdentityModule } from '$lib/server/modules/identity'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { log } from '$lib/utils/server/logger'

const presenter = ({ group }: { group: GroupsRepository }) => group

export const groupGetController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	id?: string
	configuration: Configuration
}) => {
	if (!id) {
		return err({ reason: 'Invalid Data', message: `You need to provide a group`, id: '' })
	}
	if (!session) {
		const [errors, group] = await groupGetPublicUseCase({
			id: id,
			groups_repository: getGroupsRepositoryModule()
		})
		if (errors !== null) {
			return err(errors)
		}
		return ok(group)
	}
	const [errors, group] = await groupGetUseCase({
		id: id,
		groups_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		log.error({ controller: 'groupGetController', errors })
		return err(errors)
	}
	return ok(group)
}

export const groupsGetController = async ({
	session,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, groups] = await groupsGetUseCase({
		groups_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		log.error({ controller: 'groupsGetController', errors })
		return err(errors)
	}
	return ok(groups)
}

export const groupGetUsersController = async ({
	session,
	group_id,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	group_id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!group_id) {
		return err({ reason: 'Missing ID' })
	}
	const [errors, groups] = await groupGetUsersUseCase({
		group_id,
		groups_repository: getGroupsRepositoryModule(),
		identity_service: getIdentityModule(),
		...getServerContext({ session, configuration })
	})
	if (errors === null) {
		log.error({ controller: 'groupGetUsersController', errors })
		return ok(groups)
	}
	return err(errors)
}

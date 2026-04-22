import type { Session } from '$lib/server/entities/models/identity'
import type { PermissionQuery } from '$lib/server/entities/models/permissions'
import {
	permissionsGetActorsUseCase,
	permissionsGetUseCase
} from '$lib/server/application/use_cases/permissions/get'
import { err, ok } from '$lib/server/entities/errors'
import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { getIdentityModule } from '$lib/server/modules/identity'
import { getUserModule } from '$lib/server/modules/user'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'

export const permissionsGetController = async ({
	data,
	session,
	configuration
}: {
	data: PermissionQuery
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, permissions] = await permissionsGetUseCase({
		data,
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(permissions)
}

export const permissionsGetActorsController = async ({
	session,
	configuration
}: {
	session?: Session
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, actors] = await permissionsGetActorsUseCase({
		groups_repository: getGroupsRepositoryModule(),
		users_repository: getUserModule(),
		identity_service: getIdentityModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(actors)
}

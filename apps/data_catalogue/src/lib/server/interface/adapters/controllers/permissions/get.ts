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

export const permissionsGetController = async ({
	data,
	session
}: {
	data: PermissionQuery
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, permissions] = await permissionsGetUseCase({
		session,
		data
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(permissions)
}

export const permissionsGetActorsController = async ({ session }: { session?: Session }) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, actors] = await permissionsGetActorsUseCase({
		session,
		groups_repository: getGroupsRepositoryModule(),
		users_repository: getUserModule(),
		identity_service: getIdentityModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(actors)
}

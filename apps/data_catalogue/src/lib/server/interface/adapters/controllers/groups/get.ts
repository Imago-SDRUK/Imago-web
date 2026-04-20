import { err, ok } from '$lib/server/entities/errors'
import {
	groupGetPublicUseCase,
	groupGetUseCase,
	groupGetUsersUseCase,
	// groupsGetPublicUseCase,
	groupsGetUseCase
} from '$lib/server/application/use_cases/groups/get'
import type { GroupService } from '$lib/server/entities/models/groups'
import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { getIdentityModule } from '$lib/server/modules/identity'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'

const presenter = ({ group }: { group: GroupsRepository }) => group

export const groupGetController = async ({
	session,
	id
}: {
	session: App.Locals['session']
	id?: string
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
		session: session,
		groups_repository: getGroupsRepositoryModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(group)
}

export const groupsGetController = async ({ session }: { session: App.Locals['session'] }) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, groups] = await groupsGetUseCase({
		session: session,
		groups_repository: getGroupsRepositoryModule()
	})
	if (errors === null) {
		return ok(groups)
	}
	return err(errors)
}

export const groupGetUsersController = async ({
	session,
	group_id
}: {
	session: App.Locals['session']
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
		session: session,
		groups_repository: getGroupsRepositoryModule(),
		identity_service: getIdentityModule()
	})
	if (errors === null) {
		return ok(groups)
	}
	return err(errors)
}

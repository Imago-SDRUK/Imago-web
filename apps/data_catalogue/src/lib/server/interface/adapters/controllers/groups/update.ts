import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { err } from '$lib/server/entities/errors'
import {
	groupAddUserUseCase,
	groupRemoveUserUseCase,
	groupsSyncUseCase,
	groupUpdateUseCase
} from '$lib/server/application/use_cases/groups/update'
import type { Session } from '$lib/server/entities/models/identity'
import type { UsersGroupsRequest } from '$lib/server/entities/models/groups'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'

export const groupUpdateController = async ({
	id,
	data,
	session,
	configuration
}: {
	id?: string
	data: unknown
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an id', id: 'id' })
	}
	return await groupUpdateUseCase({
		id,
		data,
		groups_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
}

export const groupSyncController = async ({
	session,
	configuration
}: {
	session?: Session
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const results = await groupsSyncUseCase({
		group_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
}

export const groupAddUserController = async ({
	relation,
	session,
	data,
	configuration
}: {
	relation: 'admins' | 'users'
	session?: Session
	data: Partial<UsersGroupsRequest>
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	return await groupAddUserUseCase({
		relation,
		data: { ...data, created_by: session.identity.id, updated_by: session.identity.id },
		groups_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
}

export const groupRemoveUserController = async ({
	session,
	user_id,
	group_id,
	configuration
}: {
	session?: Session
	user_id?: string
	group_id?: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!user_id) {
		return err({ reason: 'Invalid Data', message: `You need to provide a user ID` })
	}

	if (!group_id) {
		return err({ reason: 'Invalid Data', message: `You need to provide a group ID` })
	}
	return await groupRemoveUserUseCase({
		user_id,
		group_id,
		groups_repository: getGroupsRepositoryModule(),
		...getServerContext({ session, configuration })
	})
}

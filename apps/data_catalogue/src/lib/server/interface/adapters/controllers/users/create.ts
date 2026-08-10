import type { Session } from '$lib/server/entities/models/identity'
import type { Configuration } from '$lib/server/entities/models/configuration'
import type { UserRequest } from '$lib/server/entities/models/users'
import { err, ok } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import {
	userCreateUseCase,
	userServiceCreateUserApiKeysUseCase
} from '$lib/server/application/use_cases/users/create'
import { getUserModule } from '$lib/server/modules/user'
import { log } from '$lib/utils/server/logger'
import { userAutoEnrollUseCase } from '$lib/server/application/use_cases/users/update'
import { getGroupsRepositoryModule } from '$lib/server/modules/groups'
import { getUserServiceModule } from '$lib/server/modules/user_service'

export const userCreateController = async ({
	session,
	payload,
	configuration,
	identity_token
}: {
	session?: Session
	payload: UserRequest
	configuration: Configuration
	identity_token?: string
}) => {
	log.trace({ message: `User create controller request` })
	if (!identity_token) {
		log.trace({ message: `Error with identity token`, identity_token })
		return err({ reason: 'Unauthenticated' })
	}
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, result] = await userCreateUseCase({
		payload: payload,
		repository: getUserModule(),
		...getServerContext({ session, configuration, identity_token })
	})
	if (errors !== null) {
		log.error({ controller: 'userCreateController', errors })
		return err(errors)
	}
	const [groups_error] = await userAutoEnrollUseCase({
		groups_repository: getGroupsRepositoryModule(),
		user_id: result.id,
		users_repository: getUserModule(),
		...getServerContext({ session, configuration, identity_token })
	})
	if (groups_error !== null) {
		log.error({ message: 'error autoenrolling user', groups_error })
		return err(groups_error)
	}
	return ok(result)
}

export const userServiceCreateUserApiTokenController = async ({
	id,
	name,
	session,
	configuration
}: {
	id: string
	name: string
	session?: Session
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}

	const [errors, users] = await userServiceCreateUserApiKeysUseCase({
		user: id,
		name,
		user_service: getUserServiceModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(users)
}

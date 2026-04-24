import type { Session } from '$lib/server/entities/models/identity'
import type { Configuration } from '$lib/server/entities/models/configuration'
import type { UserRequest } from '$lib/server/entities/models/users'
import { err } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import { userCreateUseCase } from '$lib/server/application/use_cases/users/create'
import { getUserModule } from '$lib/server/modules/user'
import { log } from '$lib/utils/server/logger'
import { ok } from 'node:assert/strict'

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
	return ok(result)
}

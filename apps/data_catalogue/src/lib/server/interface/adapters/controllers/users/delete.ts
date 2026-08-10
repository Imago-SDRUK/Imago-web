import type { Session } from '$lib/server/entities/models/identity'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { err, ok } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import { getUserServiceModule } from '$lib/server/modules/user_service'
import { userServiceDeleteUserApiKeysUseCase } from '$lib/server/application/use_cases/users/delete'

export const userServiceDeleteUserApiTokenController = async ({
	id,
	session,
	configuration
}: {
	id: string
	session?: Session
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}

	const [errors, users] = await userServiceDeleteUserApiKeysUseCase({
		id,
		user_service: getUserServiceModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(users)
}

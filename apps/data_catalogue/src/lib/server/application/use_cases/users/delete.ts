import type { AppContext } from '$lib/server/application/context'
import type { IUsersService } from '$lib/server/application/services/users'
import { err } from '$lib/server/entities/errors'

export const userServiceDeleteUserApiKeysUseCase = async ({
	id,
	user_service,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	user_service: IUsersService
} & AppContext) => {
	// HACK: lets assume users authorised to read users are also allowed to read ckan users
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Application',
		object: 'users',
		permits: 'manage',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	return await user_service.deleteApiKey({ id })
}

import type { User } from '$lib/server/entities/models/users'
import { getUserModule } from '$lib/server/modules/user'
import {
	userGetGroupsUseCase,
	userGetMeUseCase,
	userGetTokenUseCase,
	userGetUseCase,
	usersGetUseCase,
	usersSearchUseCase
} from '$lib/server/application/use_cases/users/get'
import { getIdentityModule } from '$lib/server/modules/identity'
import { err, ok } from '$lib/server/entities/errors'
import type { Session } from '$lib/server/entities/models/identity'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { userCreateController } from '$lib/server/interface/adapters/controllers/users/create'
import { env } from '$env/dynamic/private'

const presenter = ({
	user
}: {
	user: User & {
		last_name: string
		email: string
		id: string
	}
}) => user

export const userGetController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	id?: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an ID', id: '' })
	}
	const [errors, user] = await userGetUseCase({
		id: id,
		user_repository: getUserModule(),
		identity_service: getIdentityModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(presenter({ user }))
}

export const userGetMeController = async ({
	session,
	configuration
}: {
	session: App.Locals['session']
	id?: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (session.identity.id === 'anonymous') {
		return ok({
			id: 'anonymous',
			groups: [],
			preferences: null,
			status: 'active',
			first_name: 'anonymous',
			last_name: 'anonymous'
		})
	}
	const [errors, user] = await userGetMeUseCase({
		user_repository: getUserModule(),
		identity_service: getIdentityModule(),
		...getServerContext({ session, configuration })
	})
	let _user = user
	// HACK: might need to move this somewhere else...?
	if (errors?.reason === 'Not Found' && !_user) {
		const [errors] = await userCreateController({
			configuration,
			identity_token: env.IDENTITY_TOKEN,
			payload: { id: session.identity.id },
			session
		})
		if (errors !== null) {
			return err(errors)
		}
		const [id_errors, id_user] = await userGetMeUseCase({
			user_repository: getUserModule(),
			identity_service: getIdentityModule(),
			...getServerContext({ session, configuration })
		})
		if (id_errors !== null) {
			return err(id_errors)
		}
		_user = id_user
	}
	if (errors !== null) {
		return err(errors)
	}
	if (_user === null) {
		return err({ reason: 'Not Found', message: 'User not found' })
	}
	return ok(presenter({ user: _user }))
}

export const userGetGroupsController = async ({
	session,
	configuration
}: {
	session: App.Locals['session']
	id?: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, user_groups] = await userGetGroupsUseCase({
		user_repository: getUserModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(user_groups)
}

export const usersGetController = async ({
	session,
	configuration,
	limit = 25,
	offset = 0
}: {
	session?: Session
	configuration: Configuration
	limit: number
	offset: number
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}

	const [errors, users] = await usersGetUseCase({
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

export const usersSearchController = async ({
	session,
	identifier,
	configuration
}: {
	session?: Session
	identifier: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, users] = await usersSearchUseCase({
		identifier,
		identity_service: getIdentityModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(users)
}

export const userGetTokenController = async ({
	cookie,
	session,
	configuration
}: {
	cookie: string
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, token] = await userGetTokenUseCase({
		cookie,
		identity_service: getIdentityModule(),
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(token)
}

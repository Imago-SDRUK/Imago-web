import type { User } from '$lib/server/entities/models/users'
import { getUserModule } from '$lib/server/modules/user'
import {
	userGetMeUseCase,
	userGetUseCase,
	usersGetUseCase,
	usersSearchUseCase
} from '$lib/server/application/use_cases/users/get'
import { getIdentityModule } from '$lib/server/modules/identity'
import { err, ok } from '$lib/server/entities/errors'
import type { Session } from '$lib/server/entities/models/identity'

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
	id
}: {
	session: App.Locals['session']
	id?: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!id) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an ID', id: '' })
	}
	const [errors, user] = await userGetUseCase({
		id: id,
		session: session,
		user_repository: getUserModule(),
		identity_service: getIdentityModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(presenter({ user }))
}

export const userGetMeController = async ({
	session
}: {
	session: App.Locals['session']
	id?: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, user] = await userGetMeUseCase({
		session: session,
		user_repository: getUserModule(),
		identity_service: getIdentityModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(presenter({ user }))
}

export const usersGetController = async ({ session }: { session?: Session }) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}

	const [errors, users] = await usersGetUseCase({
		session: session,
		user_repository: getUserModule(),
		identity_service: getIdentityModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(users)
}

export const usersSearchController = async ({
	session,
	identifier
}: {
	session?: Session
	identifier: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, users] = await usersSearchUseCase({
		session: session,
		identifier,
		identity_service: getIdentityModule()
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(users)
}

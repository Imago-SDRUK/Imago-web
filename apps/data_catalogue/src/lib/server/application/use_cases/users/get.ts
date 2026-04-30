import type { UsersRepository } from '$lib/server/application/repositories/users'
import type { IdentityService } from '$lib/server/application/services/identity'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import type { Session } from '$lib/server/entities/models/identity'
import type { User } from '$lib/server/entities/models/users'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import type { Identity } from '@ory/client-fetch'

export const userGetUseCase = async ({
	id,
	user_repository,
	identity_service,
	session,
	configuration
}: {
	session: Session
	id: string
	user_repository: UsersRepository
	identity_service: IdentityService
	configuration: Configuration
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'users',
		permits: 'read',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, user] = await user_repository.getUser({ id })
	if (errs !== null) {
		return err(errs)
	}
	if (!user) {
		return err({ reason: 'Unexpected' })
	}
	const [errs_identity, identity] = await identity_service.getIdentity({ id })
	if (errs_identity !== null) {
		return err({ reason: 'Unauthorised' })
	}

	if (identity === null) {
		return err({ reason: 'Unauthorised' })
	}
	return ok({
		first_name: identity.first_name,
		last_name: identity.last_name,
		email: identity.email,
		id: user.id,
		status: user.status,
		groups: user.groups,
		// groups: groups.relation_tuples?.map((group) => group.object),
		preferences: user.preferences,
		created_at: user.created_at,
		updated_at: user.updated_at,
		deleted_at: user.deleted_at
	})
}

export const userGetMeUseCase = async ({
	user_repository,
	identity_service,
	session,
	configuration
}: {
	session: Session
	user_repository: UsersRepository
	identity_service: IdentityService
	configuration: Configuration
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'User',
		object: session.identity.id,
		permits: 'members',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, user] = await user_repository.getUser({ id: session.identity.id })
	if (errs !== null) {
		return err(errs)
	}
	if (!user) {
		return err({ reason: 'Not Found', message: 'User not found' })
	}
	const [errs_identity, identity] = await identity_service.getIdentity({ id: session.identity.id })
	if (errs_identity !== null) {
		return err({ reason: 'Unauthorised' })
	}

	if (identity === null) {
		return err({ reason: 'Unauthorised' })
	}
	return ok({
		first_name: identity.first_name,
		last_name: identity.last_name,
		email: identity.email,
		id: user.id,
		status: user.status,
		groups: user.groups,
		// groups: groups.relation_tuples?.map((group) => group.object),
		preferences: user.preferences,
		created_at: user.created_at,
		updated_at: user.updated_at,
		deleted_at: user.deleted_at
	})
}

export const userGetGroupsUseCase = async ({
	user_repository,
	session,
	configuration
}: {
	session: Session
	user_repository: UsersRepository
	configuration: Configuration
}) => {
	if (session.identity.id === 'anonymous') {
		return ok([])
	}
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'User',
		object: session.identity.id,
		permits: 'members',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, user_groups] = await user_repository.getUserGroups({ id: session.identity.id })
	if (errs !== null) {
		return err(errs)
	}

	return ok(user_groups)
}

export const usersGetUseCase = async ({
	limit = 25,
	offset = 0,
	user_repository,
	identity_service,
	session,
	configuration
}: {
	limit?: number
	offset?: number
	session: Session
	user_repository: UsersRepository
	identity_service: IdentityService
	configuration: Configuration
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'users',
		permits: 'read',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, users] = await user_repository.getUsers({ limit, offset })
	if (errs !== null) {
		console.log('users repo errors')
		return err(errs)
	}
	if (!users) {
		return err({ reason: 'Unexpected', error: users })
	}
	const users_identities = await Promise.all(
		users.items.map((user) =>
			identity_service.getIdentity({ id: user.id }).then(([errors, data]) => {
				if (errors !== null) {
					if (errors.reason === 'Not Found') {
						console.log(errors)

						return ok({ ...user })
					}
					return err(errors)
				}
				return ok({ ...user, ...data })
			})
		)
	)
	const joined = users_identities.reduce(
		(acc, [errors, user]) => {
			if (errors !== null) {
				acc.errors.push(errors)
				return acc
			}
			acc.identities.push(user)
			return acc
		},
		{ errors: [], identities: [] } as {
			errors: ErrTypes[]
			identities: (User & { first_name?: string; last_name?: string })[]
		}
	)
	if (joined.errors.length > 0) {
		return err(joined.errors[0])
	}
	return ok({ ...users, items: joined.identities })
}

export const usersSearchUseCase = async ({
	// user_repository,
	identifier,
	identity_service,
	session,
	configuration
}: {
	identifier: string
	session: Session
	identity_service: IdentityService
	configuration: Configuration
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'users',
		permits: 'read',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	if (!identifier) {
		return ok([])
	}
	if (identifier === '') {
		return ok([])
	}
	if (identifier.length < 3) {
		return ok([])
	}
	const [errs, users] = await identity_service.getIdentities({ identifier })
	if (errs !== null) {
		return err(errs)
	}
	if (!users) {
		return err({ reason: 'Unexpected' })
	}
	// const identity = await identity_service.getIdentity({ id })
	// if (!identity) {
	// 	return err({ reason: 'Unauthorised' })
	// }
	return ok(users)
}

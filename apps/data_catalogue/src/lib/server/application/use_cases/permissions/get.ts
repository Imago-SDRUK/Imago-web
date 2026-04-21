import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import {
	PermissionQuerySchema,
	type PermissionRequest
} from '$lib/server/entities/models/permissions'
import { type } from 'arktype'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import type { UsersRepository } from '$lib/server/application/repositories/users'
import type { IdentityService } from '$lib/server/application/services/identity'
import type { User } from '$lib/server/entities/models/users'

export const permissionsGetUseCase = async ({
	data,
	session
}: {
	data: unknown
	session: Session
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'permissions',
		permits: 'read'
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = PermissionQuerySchema(data)
	if (schema instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: schema.summary, id: 'invalid-data' })
	}
	const [errs, permissions] = await auth_module.getPermissions(schema)
	if (errs !== null) {
		return err(errs)
	}
	return ok(permissions)
}

export const permissionsGetActorsUseCase = async ({
	session,
	groups_repository,
	users_repository,
	identity_service
}: {
	session: Session
	groups_repository: GroupsRepository
	users_repository: UsersRepository
	identity_service: IdentityService
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'permissions',
		permits: 'read'
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [groups_err, groups] = await groups_repository.getGroups({ limit: 999, offset: 0 })
	if (groups_err !== null) {
		return err(groups_err)
	}

	const [users_err, users] = await users_repository.getUsers({ limit: 999, offset: 0 })
	if (users_err !== null) {
		return err(users_err)
	}

	const identities = await Promise.all(
		users.items.map((user) =>
			identity_service.getIdentity({ id: user.id }).then(([errors, identity]) => {
				if (errors !== null) {
					if (errors.reason === 'Not Found') {
						return ok(null)
					}
					return err(errors)
				}

				return ok({
					...user,
					email: identity?.email,
					first_name: identity?.first_name,
					last_name: identity?.last_name
				})
			})
		)
	)

	const parsed_users = identities.reduce(
		(acc, [errors, resource]) => {
			if (errors !== null) {
				acc.errors.push(errors)
			}
			if (resource !== null) {
				acc.users.push(resource)
			}
			return acc
		},
		{ errors: [], users: [] } as {
			errors: ErrTypes[]
			users: (User & { first_name?: string; last_name?: string; email?: string })[]
		}
	)
	if (parsed_users.errors.length > 0) {
		return err(parsed_users.errors[0])
	}
	const parsed: {
		label: string
		actor: PermissionRequest['actor']
	}[] = [
		...groups.flatMap((group) => [
			{
				label: `${group.title} - admins`,
				actor: {
					namespace: 'Group' as const,
					object: group.id,
					relation: 'admins'
				}
			},
			{
				label: `${group.title} - users`,
				actor: {
					namespace: 'Group' as const,
					object: group.id,
					relation: 'users'
				}
			}
		]),
		...parsed_users.users.map((user) => ({
			label: String(user.email),
			actor: user.id
		})),
		{ label: 'Public', actor: 'anonymous' }
	]
	return ok(parsed)
}

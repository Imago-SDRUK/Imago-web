import type { UserRequest } from '$lib/server/entities/models/users'
import type { UsersRepository } from '$lib/server/application/repositories/users'
import type { AppContext } from '$lib/server/application/context'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import { env } from '$env/dynamic/private'
import { log } from '$lib/utils/server/logger'

export const userAddGroupUseCase = async ({
	user_id,
	group_id,
	user_repository,
	session,
	authorisation_module,
	configuration
}: {
	user_id: string
	group_id: string
	user_repository: UsersRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'users',
		permits: 'create',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [ug_errors, user_groups] = await user_repository.getUserGroups({ id: user_id })
	if (ug_errors !== null) {
		return err(ug_errors)
	}
	if (user_groups.find((ug) => ug.user_id === user_id && ug.group_id === group_id)) {
		return ok(user_groups)
	}
	const [ug_errs, user_group] = await user_repository.addUserToGroup({
		data: { user_id, group_id }
	})
	if (ug_errs !== null) {
		return err(ug_errs)
	}
	const [auth_errs] = await authorisation_module.createPermission({
		namespace: 'Group',
		object: group_id,
		relation: 'members',
		actor: user_id
	})
	if (auth_errs !== null) {
		return err(auth_errs)
	}
	return ok(user_group)
}

export const userRemoveGroupUseCase = async ({
	user_id,
	group_id,
	user_repository,
	session,
	configuration,
	authorisation_module
}: {
	user_id: string
	group_id: string
	user_repository: UsersRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'users',
		permits: 'update',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [ug_errs, user_group] = await user_repository.removeUserGroup({
		data: { user_id, group_id }
	})
	if (ug_errs !== null) {
		return err(ug_errs)
	}
	const [auth_errs] = await authorisation_module.deletePermission({
		namespace: 'Group',
		object: group_id,
		relation: 'members',
		actor: user_id
	})
	if (auth_errs !== null) {
		return err(auth_errs)
	}
	return ok(user_group)
}

export const userUpdateUseCase = async ({
	id,
	data,
	user_repository,
	session,
	authorisation_module,
	configuration
}: {
	id: string
	data: Partial<UserRequest>
	user_repository: UsersRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
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
	const payload: UserRequest = {
		status: data.status,
		preferences: data.preferences
	}
	const [errs, updated_user] = await user_repository.updateUser({ data: payload, id })
	if (errs !== null) {
		return err(errs)
	}
	if (!updated_user) {
		return err({ reason: 'Not Found', message: 'user not found' })
	}
	return ok(updated_user)
}

export const userAutoEnrollUseCase = async ({
	user_id,
	groups_repository,
	users_repository,
	// session,
	identity_token,
	configuration,
	authorisation_module
}: {
	user_id: string
	users_repository: UsersRepository
	groups_repository: GroupsRepository
} & AppContext) => {
	if (identity_token !== env.IDENTITY_TOKEN) {
		return err({ reason: 'Unauthorised' })
	}
	// const [errs, permissions] = await authorisation_module.batchAuthorise({
	// 	permissions: [
	// 		{
	// 			namespace: 'User',
	// 			object: session.identity.id,
	// 			permits: 'members',
	// 			actor: session.identity.id
	// 		},
	// 		{
	// 			namespace: 'Action',
	// 			object: 'users',
	// 			permits: 'create',
	// 			actor: session.identity.id
	// 		}
	// 	]
	// })
	// if (errs) {
	// 	return err(errs)
	// }
	// console.log(jstr(permissions))
	// const permission = permissions.results.some((permission) => permission.allowed)
	// if (!permission) {
	// 	return err({ reason: 'Unauthorised' })
	// }
	const [errors, user] = await users_repository.getUser({ id: user_id })
	if (errors !== null) {
		return err(errors)
	}
	if (user === null) {
		return err({ reason: 'Unexpected', error: `There's been an issue getting this user`, id: '' })
	}
	const [groups_errors, groups] = await groups_repository.getGroupsAutoenroll()
	if (groups_errors !== null) {
		return err(groups_errors)
	}
	const enroll_errors: ErrTypes[] = []
	for (const group of groups) {
		const [errs] = await users_repository.addUserToGroup({
			data: {
				user_id: user.id,
				group_id: group.id,
				created_by: configuration?.superusers?.[0],
				updated_by: configuration?.superusers?.[0]
			}
		})
		if (errs) {
			enroll_errors.push(errs)
		}
		const [auth_errs] = await authorisation_module.createPermission({
			namespace: 'Group',
			object: group.id,
			relation: 'members',
			actor: user_id
		})
		if (auth_errs !== null) {
			enroll_errors.push(auth_errs)
		}
	}
	if (enroll_errors.length > 0) {
		log.error({ message: 'fail to autoenroll user', user: user.id, enroll_errors })
		return err(enroll_errors[0])
	}

	return ok(null)
}

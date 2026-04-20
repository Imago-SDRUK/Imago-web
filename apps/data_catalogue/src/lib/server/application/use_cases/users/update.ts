import type { Session } from '$lib/server/entities/models/identity'
import type { UserRequest } from '$lib/server/entities/models/users'
import type { UsersRepository } from '$lib/server/application/repositories/users'
import { err, ok } from '$lib/server/entities/errors'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const userAddGroupUseCase = async ({
	user_id,
	group_id,
	user_repository,
	session
}: {
	user_id: string
	group_id: string
	user_repository: UsersRepository
	session: Session
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'users',
		permits: 'create'
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
	const [auth_errs] = await auth_module.createPermission({
		namespace: 'Group',
		object: group_id,
		relation: 'users',
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
	session
}: {
	user_id: string
	group_id: string
	user_repository: UsersRepository
	session: Session
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'users',
		permits: 'create'
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
	const [auth_errs] = await auth_module.deletePermission({
		namespace: 'Group',
		object: group_id,
		relation: 'users',
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
	session
}: {
	id: string
	data: Partial<UserRequest>
	user_repository: UsersRepository
	session: Session
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'users',
		permits: 'create'
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
		return err({ reason: 'Not Found' })
	}
	return ok(updated_user)
}

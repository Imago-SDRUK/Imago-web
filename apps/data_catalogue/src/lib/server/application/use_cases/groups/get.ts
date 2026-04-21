import type { GroupsRepository } from '$lib/server/application/repositories/groups'
// import type { GroupsService } from '$lib/server/application/services/groups'
import type { IdentityService } from '$lib/server/application/services/identity'
import { err, ok } from '$lib/server/entities/errors'
import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const groupGetPublicUseCase = async ({
	id,
	groups_repository
}: {
	id: string
	groups_repository: GroupsRepository
}) => {
	const [errors, service_group] = await groups_repository.getGroup({ id })
	const [rg_errors] = await groups_repository.getGroup({ id })
	if (errors !== null) {
		return err(errors)
	}
	if (rg_errors !== null) {
		return err(rg_errors)
	}

	return ok(service_group)
}

export const groupGetUseCase = async ({
	id,
	// groups_service,
	session,
	groups_repository
}: {
	session: Session
	id: string
	groups_repository: GroupsRepository
	// groups_service: GroupsService
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Group',
		object: id,
		permits: 'users'
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	// const [sg_errors, service_group] = await groups_service.getGroup({ id })
	// if (sg_errors !== null) {
	// 	return err(sg_errors)
	// }
	const [rg_errors, group] = await groups_repository.getGroup({ id })
	if (rg_errors !== null) {
		// HACK: remove exception once groups are migrated
		if (rg_errors.reason !== 'Invalid Data') {
			return err(rg_errors)
		}
	}
	// if (!service_group) {
	// 	return err({ reason: 'Not Found' })
	// }
	return ok(group)
}

export const groupsGetUseCase = async ({
	// groups_service,
	session,
	groups_repository
}: {
	session: Session
	// groups_service: GroupsService
	groups_repository: GroupsRepository
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'groups',
		permits: 'read'
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	// const [sg_errors, service_groups] = await groups_service.getGroups({ page_size: 1000, offset: 0 })
	const [rg_errors, groups] = await groups_repository.getGroups({
		limit: 1000,
		offset: 0
	})
	// if (sg_errors) {
	// 	return err(sg_errors)
	// }
	// if (!service_groups) {
	// 	return err({ reason: 'Not Found' })
	// }
	if (rg_errors !== null) {
		return err(rg_errors)
	}

	return ok(groups)
}

// export const groupsGetPublicUseCase = async (
// 	{
// 		// groups_service
// 	}: {
// 		// groups_service: GroupsService
// 	}
// ) => {
// 	// const [errs, groups] = await groups_service.getGroups({ page_size: 1000, offset: 0 })
// 	// if (errs !== null) {
// 	// 	return err(errs)
// 	// }
// 	// if (!groups) {
// 	// 	return err({ reason: 'Not Found' })
// 	// }
// 	//
// 	// // TODO: add get user groups logic
// 	// return ok(groups)
// }

export const groupGetUsersUseCase = async ({
	session,
	groups_repository,
	group_id,
	identity_service
}: {
	session: Session
	group_id: string
	groups_repository: GroupsRepository
	identity_service: IdentityService
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'groups',
		permits: 'read'
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [rg_errors, users] = await groups_repository.getGroupUsers({ id: group_id })
	if (rg_errors !== null) {
		return err(rg_errors)
	}
	if (users.length === 0) {
		return ok([])
	}
	const [i_errs, identities] = await identity_service.getIdentities({
		ids: users.map(({ id }) => id)
	})
	if (i_errs !== null) {
		return err(i_errs)
	}
	return ok(identities)
}

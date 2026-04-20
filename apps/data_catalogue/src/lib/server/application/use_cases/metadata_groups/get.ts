import type { GroupsService } from '$lib/server/application/services/groups'
import { err, ok } from '$lib/server/entities/errors'
import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const metadataGroupGetPublicUseCase = async ({
	id,
	groups_service
	// groups_repository
}: {
	id: string
	// groups_repository: GroupsRepository
	groups_service: GroupsService
}) => {
	const [errors, service_group] = await groups_service.getGroup({ id })
	if (errors !== null) {
		return err(errors)
	}
	return ok(service_group)
}

export const metadataGroupGetUseCase = async ({
	id,
	groups_service,
	session
}: {
	session: Session
	id: string
	groups_service: GroupsService
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
	const [sg_errors, service_group] = await groups_service.getGroup({ id })
	if (sg_errors !== null) {
		return err(sg_errors)
	}
	return ok(service_group)
}

export const metadataGroupsGetUseCase = async ({
	groups_service,
	session
}: {
	session: Session
	groups_service: GroupsService
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

	const [sg_errors, service_groups] = await groups_service.getGroups({ page_size: 1000, offset: 0 })
	if (sg_errors) {
		return err(sg_errors)
	}
	if (!service_groups) {
		return err({ reason: 'Not Found' })
	}
	// TODO: add get user groups logic
	return ok(service_groups)
}

export const metadataGroupsGetPublicUseCase = async ({
	groups_service
}: {
	groups_service: GroupsService
}) => {
	const [errs, groups] = await groups_service.getGroups({ page_size: 1000, offset: 0 })
	if (errs !== null) {
		return err(errs)
	}
	if (!groups) {
		return err({ reason: 'Not Found' })
	}

	// TODO: add get user groups logic
	return ok(groups)
}

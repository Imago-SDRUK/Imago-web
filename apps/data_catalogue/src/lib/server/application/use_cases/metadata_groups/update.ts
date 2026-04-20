import type { Session } from '$lib/server/entities/models/identity'
import type { GroupsService } from '$lib/server/application/services/groups'
import { err, ok } from '$lib/server/entities/errors'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const metadataGroupUpdateUseCase = async ({
	id,
	data,
	session,
	groups_service
	// groups_repository
}: {
	id: string
	data: unknown
	session: Session
	groups_service: GroupsService
	// groups_repository: GroupsRepository
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		namespace: 'Action',
		object: 'groups',
		permits: 'update',
		actor: session.identity.id
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	if (typeof data !== 'object') {
		return err({ reason: 'Invalid Data', message: 'You need to provide an object', id: '' })
	}
	if (data === null) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an object', id: '' })
	}
	if ('title' in data === false) {
		return err({ reason: 'Invalid Data', message: 'You need to provide a title', id: '' })
	}

	const [error_g, group] = await groups_service.updateGroup({
		id,
		//TODO: add metadata group schema
		data
	})
	if (error_g !== null) {
		return err(error_g)
	}
	return ok(group)
}

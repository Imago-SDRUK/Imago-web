import type { AppContext } from '$lib/server/application/context'
import type { GroupsService } from '$lib/server/application/services/groups'
import { err, ok } from '$lib/server/entities/errors'

export const metadataGroupUpdateUseCase = async ({
	id,
	data,
	session,
	groups_service,
	configuration,
	authorisation_module
}: {
	id: string
	data: unknown
	groups_service: GroupsService
	// groups_repository: GroupsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'groups',
		permits: 'update',
		actor: session.identity.id,
		configuration
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

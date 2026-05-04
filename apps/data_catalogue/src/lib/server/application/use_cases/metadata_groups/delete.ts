import type { GroupsService } from '$lib/server/application/services/groups'
import type { AppContext } from '$lib/server/application/context'
import { err, ok } from '$lib/server/entities/errors'

export const metadataGroupDeleteUseCase = async ({
	id,
	session,
	group_service,
	configuration,
	authorisation_module
}: {
	id: string
	group_service: GroupsService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'groups',
		permits: 'delete',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs] = await group_service.deleteGroup({ id })
	if (errs) {
		return err(errs)
	}
	return ok(null)
}

import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'
import type { GroupsService } from '$lib/server/application/services/groups'

export const metadataGroupDeleteUseCase = async ({
	id,
	session,
	group_service
}: {
	id: string
	group_service: GroupsService
	session: Session
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		namespace: 'Action',
		object: 'groups',
		permits: 'delete',
		actor: session.identity.id
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

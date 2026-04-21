import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'

export const groupDeleteUseCase = async ({
	id,
	session,
	group_repository
}: {
	id: string
	group_repository: GroupsRepository
	session: Session
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		namespace: 'Group',
		object: id,
		permits: 'admins',
		actor: session.identity.id
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs_g] = await group_repository.deleteGroup({ id })
	if (errs_g !== null) {
		return err(errs_g)
	}
	const [d_errs] = await auth_module.deletePermission({ namespace: 'Group', object: id })
	if (d_errs !== null) {
		return err(d_errs)
	}
	return ok(null)
}

import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import type { AppContext } from '$lib/server/application/context'
import { err, ok } from '$lib/server/entities/errors'

export const groupDeleteUseCase = async ({
	id,
	session,
	group_repository,
	configuration,
	authorisation_module
}: {
	id: string
	group_repository: GroupsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Group',
		object: id,
		permits: 'admins',
		actor: session.identity.id,
		configuration
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
	const [d_errs] = await authorisation_module.deletePermission({ namespace: 'Group', object: id })
	if (d_errs !== null) {
		return err(d_errs)
	}
	return ok(null)
}

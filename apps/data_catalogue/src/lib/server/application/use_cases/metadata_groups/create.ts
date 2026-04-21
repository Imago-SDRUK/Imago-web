import type { Session } from '$lib/server/entities/models/identity'
import type { GroupsService } from '$lib/server/application/services/groups'
// import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import { err, ok } from '$lib/server/entities/errors'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import slugify from '@sindresorhus/slugify'

export const metadataGroupCreateUseCase = async ({
	data,
	session,
	groups_service
}: {
	data: unknown
	session: Session
	groups_service: GroupsService
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		namespace: 'Action',
		object: 'groups',
		permits: 'create',
		actor: session.identity.id
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [error_g, group] = await groups_service.createGroup({
		// TODO: metadata group schema
		// data
		data: { ...data, name: slugify(data.title) }
	})
	if (error_g !== null) {
		return err(error_g)
	}
	return ok(group)
}

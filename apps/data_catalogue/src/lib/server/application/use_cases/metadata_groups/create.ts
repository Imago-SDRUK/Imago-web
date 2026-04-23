import type { GroupsService } from '$lib/server/application/services/groups'
import { err, ok } from '$lib/server/entities/errors'
import slugify from '@sindresorhus/slugify'
import type { AppContext } from '$lib/server/application/context'

export const metadataGroupCreateUseCase = async ({
	data,
	session,
	groups_service,
	configuration,
	authorisation_module
}: {
	data: unknown
	groups_service: GroupsService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'groups',
		permits: 'create',
		actor: session.identity.id,
		configuration
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

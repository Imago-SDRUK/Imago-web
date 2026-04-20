import type { Session } from '$lib/server/entities/models/identity'
// import type { GroupsService } from '$lib/server/application/services/groups'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import { type } from 'arktype'
import { err, ok } from '$lib/server/entities/errors'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { groups } from '$lib/db/schema'
import { createInsertSchema } from 'drizzle-arktype'
import slugify from '@sindresorhus/slugify'

export const groupCreateUseCase = async ({
	data,
	session,
	// groups_service,
	groups_repository
}: {
	data: unknown
	session: Session
	// groups_service: GroupsService
	groups_repository: GroupsRepository
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
	const groupSchema = createInsertSchema(groups)
	if (typeof data !== 'object') {
		return err({ reason: 'Invalid Data', message: 'You need to provide an object', id: '' })
	}
	if (data === null) {
		return err({ reason: 'Invalid Data', message: 'You need to provide an object', id: '' })
	}
	if ('title' in data === false) {
		return err({ reason: 'Invalid Data', message: 'You need to provide a title', id: '' })
	}
	const group_data = groupSchema({
		...data,
		slug: slugify(data?.title),
		updated_by: session.identity.id,
		created_by: session.identity.id
	})
	if (group_data instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: group_data.summary, id: 'invalid-dataset' })
	}
	const [err_g, group_r] = await groups_repository.createGroup({
		data: group_data
	})
	if (err_g !== null) {
		return err(err_g)
	}

	return ok(group_r)
}

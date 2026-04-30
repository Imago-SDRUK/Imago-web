import type { Session } from '$lib/server/entities/models/identity'
// import type { GroupsService } from '$lib/server/application/services/groups'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import { type } from 'arktype'
import { err, ok } from '$lib/server/entities/errors'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { groups, users_groups } from '$lib/db/schema'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-arktype'
import slugify from '@sindresorhus/slugify'
import type { UsersGroupsRequest } from '$lib/server/entities/models/groups'
import type { AppContext } from '$lib/server/application/context'
import type { QuestionsRepository } from '$lib/server/application/repositories/questions'
import type { PermissionRequest } from '$lib/server/entities/models/permissions'

export const groupUpdateUseCase = async ({
	id,
	data,
	session,
	groups_repository,
	configuration,
	authorisation_module
}: {
	id: string
	data: unknown
	session: Session
	groups_repository: GroupsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Group',
		object: id,
		permits: 'members',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const groupSchema = createUpdateSchema(groups)
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
		slug: data?.title ? slugify(data?.title as string) : undefined,
		updated_by: session.identity.id,
		autoenroll: data.autoenroll === 'true' ? true : false
	})
	if (group_data instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: group_data.summary, id: 'invalid-dataset' })
	}
	const [err_g, group_r] = await groups_repository.updateGroup({
		data: {
			slug: group_data.slug,
			status: group_data.status,
			description: group_data.description,
			title: group_data.title,
			visibility: group_data.visibility,
			updated_at: group_data.updated_at,
			updated_by: group_data.updated_by
			// autoenroll: group_data.autoenroll
		},
		id
	})
	if (err_g !== null) {
		return err(err_g)
	}
	if (group_r === null) {
		return err({ reason: 'Unexpected' })
	}
	// const [error_g] = await groups_service.updateGroup({
	// 	id,
	// 	data: {
	// 		description: group_r.description,
	// 		title: group_r.title
	// 	}
	// })
	// if (error_g !== null) {
	// 	return err(error_g)
	// }
	return ok(group_r)
}

export const groupAddDatasetUseCase = async ({
	dataset_id,
	group_id,
	session,
	groups_repository
}: {
	dataset_id: string
	group_id: string
	session: Session
	groups_repository: GroupsRepository
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		namespace: 'Group',
		object: group_id,
		permits: 'admins',
		actor: session.identity.id
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [gr_err, group] = await groups_repository.addDatasetToGroup({
		dataset_id,
		id: group_id
	})
	if (gr_err !== null) {
		return err(gr_err)
	}
	return ok(group)
}

export const groupRemoveDatasetUseCase = async ({
	dataset_id,
	group_id,
	session,
	groups_repository
}: {
	dataset_id: string
	group_id: string
	session: Session
	groups_repository: GroupsRepository
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		namespace: 'Group',
		object: group_id,
		permits: 'admins',
		actor: session.identity.id
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [gr_err, group] = await groups_repository.removeDatasetFromGroup({
		dataset_id,
		id: group_id
	})
	if (gr_err !== null) {
		return err(gr_err)
	}
	return ok(group)
}

export const groupsSyncUseCase = async ({
	session,
	// group_service,
	group_repository
}: {
	session: Session
	// group_service: GroupsService
	group_repository: GroupsRepository
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		namespace: 'Action',
		object: 'groups',
		permits: 'edit',
		actor: session.identity.id
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	// const [errs, groups] = await group_service.getGroups({ offset: 0, page_size: 999 })
	// if (errs !== null) {
	// 	return err(errs)
	// }
	// const existing_groups = await Promise.all(
	// 	groups.map((group) =>
	// 		group_repository
	// 			.getGroup({ id: typeof group === 'string' ? group : group.id })
	// 			.then(async ([errors, g]) => {
	// 				if (errors !== null) {
	// 					return err(errors)
	// 				}
	// 				if (g === null) {
	// 					const slug = typeof group === 'string' ? slugify(group) : slugify(group.title)
	// 					const title = typeof group === 'string' ? group : group.title
	// 					const g_id = typeof group === 'string' ? group : group.id
	// 					const [gr_err, gr_new] = await group_repository.createGroup({
	// 						data: {
	// 							slug: slug,
	// 							title: title,
	// 							id: g_id,
	// 							created_by: session.identity.id,
	// 							updated_by: session.identity.id
	// 						}
	// 					})
	// 					if (gr_err !== null) {
	// 						return err(gr_err)
	// 					}
	// 					return ok(gr_new)
	// 				}
	// 				return ok(g)
	// 			})
	// 	)
	// )
	// return existing_groups
}

export const groupAddUserUseCase = async ({
	data,
	session,
	groups_repository,
	configuration,
	authorisation_module
}: {
	data: Partial<UsersGroupsRequest>
	groups_repository: GroupsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Group',
		object: configuration.admin_group ?? undefined,
		permits: 'members',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(users_groups)
	const validated = schema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary })
	}
	const [gr_err, user_group] = await groups_repository.addUserToGroup({
		data: validated
	})
	if (gr_err !== null) {
		return err(gr_err)
	}
	const [p_err, perm] = await authorisation_module.createPermission({
		namespace: 'Group',
		object: validated.group_id,
		relation: 'members',
		actor: validated.user_id
	})
	if (p_err !== null) {
		return err(p_err)
	}
	if (perm === null) {
		return err({ reason: 'Unexpected' })
	}
	return ok(user_group)
}

export const groupRemoveUserUseCase = async ({
	user_id,
	group_id,
	session,
	groups_repository,
	configuration,
	authorisation_module
}: {
	user_id: string
	group_id: string
	groups_repository: GroupsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Group',
		object: configuration.admin_group ?? undefined,
		permits: 'members',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createSelectSchema(users_groups)
		.omit('created_at')
		.omit('updated_at')
		.omit('created_by')
		.omit('updated_by')
	const validated = schema({ user_id, group_id })
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary })
	}
	const [gr_err, user_group] = await groups_repository.removeUserFromGroup(validated)
	if (gr_err !== null) {
		return err(gr_err)
	}
	const [p_err, perm] = await authorisation_module.deletePermission({
		namespace: 'Group',
		actor: validated.user_id,
		object: validated.group_id
	})
	if (p_err !== null) {
		return err(p_err)
	}
	if (perm !== null) {
		return err({ reason: 'Unexpected' })
	}
	return ok(user_group)
}

export const groupToggleAutoenrollUseCase = async ({
	id,
	autoenroll,
	session,
	groups_repository,
	configuration,
	authorisation_module,
	questions_repository
}: {
	id: string
	autoenroll: boolean
	session: Session
	groups_repository: GroupsRepository
	questions_repository: QuestionsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Group',
		object: id,
		permits: 'members',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [err_g, group_r] = await groups_repository.updateGroup({
		data: {
			autoenroll
		},
		id
	})
	if (err_g !== null) {
		return err(err_g)
	}
	if (group_r === null) {
		return err({ reason: 'Unexpected', error: group_r })
	}
	const [questions_errors, questions] = await questions_repository.getQuestions({
		limit: 250,
		offset: 0
	})
	if (questions_errors !== null) {
		return err(questions_errors)
	}
	const permissions: PermissionRequest[] = [
		{
			namespace: 'Action',
			object: 'answers',
			relation: 'groups',
			actor: group_r.id
		},
		...questions.map((question) => ({
			namespace: 'Question' as const,
			relation: 'viewers',
			object: question.id,
			actor: { namespace: 'Group' as const, object: group_r.id, relation: 'members' }
		}))
	]

	if (autoenroll) {
		const [errors] = await authorisation_module.createPermissions({ permissions: permissions })
		if (errors !== null) {
			return err(errors)
		}
	}
	if (!autoenroll) {
		const [errors] = await authorisation_module.deletePermissions({ permissions: permissions })
		if (errors !== null) {
			return err(errors)
		}
	}
	return ok(group_r)
}

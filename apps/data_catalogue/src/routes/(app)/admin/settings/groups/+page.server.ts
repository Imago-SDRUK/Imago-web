import { fail } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'
import { formGetStringOrUndefined, parseForm } from '$lib/utils/forms/index.js'
import { groupCreateController } from '$lib/server/interface/adapters/controllers/groups/create.js'
import { groupDeleteController } from '$lib/server/interface/adapters/controllers/groups/delete.js'
import {
	groupAddUserController,
	groupRemoveUserController,
	groupUpdateController
} from '$lib/server/interface/adapters/controllers/groups/update.js'
import {
	groupGetController,
	groupGetUsersController,
	groupsGetController
} from '$lib/server/interface/adapters/controllers/groups/get.js'
import { usersSearchController } from '$lib/server/interface/adapters/controllers/users/get.js'
// import { permissionsGetController } from '$lib/server/interface/adapters/controllers/permissions/get.js'
// import type { Relationships } from '$lib/server/entities/models/permissions.js'
import type { Group } from '$lib/server/entities/models/groups.js'

export const load = async ({ locals, url }) => {
	const [errors, groups] = await groupsGetController({ session: locals.session })
	if (errors !== null) {
		error(500, { message: errors.reason, id: errors.reason })
	}
	const edit = url.searchParams.get('edit')
	let group_users: { first_name: string; last_name: string; email: string; id: string }[] = []
	// let existing: Relationships | null = null
	let group: Group | null = null
	if (edit) {
		group = await groupGetController({ session: locals.session, id: edit }).then(
			([errors, users]) => {
				if (errors !== null) {
					error(500, { message: errors.reason, id: errors.reason })
				}
				return users
			}
		)
		// existing = await permissionsGetController({
		// 	data: { namespace: 'Group', object: 'admin' },
		// 	session: locals.session
		// }).then(([errors, users]) => {
		// 	if (errors !== null) {
		// 		error(500, { message: errors.reason, id: errors.reason })
		// 	}
		// 	return users
		// })

		group_users = await groupGetUsersController({ session: locals.session, group_id: edit }).then(
			([errors, users]) => {
				if (errors !== null) {
					error(500, { message: errors.reason, id: errors.reason })
				}
				return users
			}
		)
	}
	return {
		groups,
		group_users,
		group
	}
}

export const actions = {
	create: async ({ locals, request }) => {
		const form = parseForm(await request.formData())
		const [errors] = await groupCreateController({ data: form, session: locals.session })
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.reason })
		}
		return {
			message: 'Group created'
		}
	},
	edit: async ({ locals, request }) => {
		const form = await request.formData()
		const id = formGetStringOrUndefined({ form, field: 'id' })
		const data = parseForm(form)
		const [errors, group] = await groupUpdateController({ id, data: data, session: locals.session })
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.reason })
		}
		console.log(group)
		return {
			message: 'Group updated'
		}
	},
	delete: async ({ locals, request }) => {
		const form = await request.formData()
		const id = formGetStringOrUndefined({ form, field: 'id' })
		const [errors] = await groupDeleteController({ id, session: locals.session })
		if (errors !== null) {
			return fail(500, { message: errors.reason })
		}
		return {
			message: 'Group deleted'
		}
	},
	add_user: async ({ locals, request }) => {
		const form = await request.formData()
		const payload = {
			user_id: formGetStringOrUndefined({ form, field: 'user_id' }),
			group_id: formGetStringOrUndefined({ form, field: 'group_id' }),
			relation: formGetStringOrUndefined({ form, field: 'relation' })
		}
		const [errors] = await groupAddUserController({
			relation: payload.relation,
			session: locals.session,
			data: payload
		})
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.reason })
		}
		return {
			message: `User successfully added`
		}
	},
	remove_user: async ({ locals, request }) => {
		const form = await request.formData()
		const payload = {
			user_id: formGetStringOrUndefined({ form, field: 'user_id' }),
			group_id: formGetStringOrUndefined({ form, field: 'group_id' })
		}
		const [errors] = await groupRemoveUserController({
			session: locals.session,
			...payload
		})
		if (errors !== null) {
			return fail(500, { message: errors.reason })
		}
		return {
			message: `User successfully added`
		}
	},
	search_users: async ({ locals, request }) => {
		const form = await request.formData()
		const identifier = formGetStringOrUndefined({ form, field: 'identifier' })
		const [errors, users] = await usersSearchController({
			session: locals.session,
			identifier: String(identifier)
		})
		if (errors !== null) {
			return fail(500, { message: errors.reason })
		}
		return {
			message: `Ok`,
			users
		}
	}
}

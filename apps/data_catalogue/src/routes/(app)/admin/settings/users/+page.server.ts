import { error, fail } from '@sveltejs/kit'
import { log } from '$lib/utils/server/logger.js'
import { authorise, ketoRead, ketoWrite } from '$lib/utils/auth/index.js'
import { formGetStringOrUndefined } from '$lib/utils/forms/index.js'
import { userCreateController } from '$lib/server/interface/adapters/controllers/users/create.js'
import {
	userGetMeController,
	usersGetController
} from '$lib/server/interface/adapters/controllers/users/get.js'
import { groupsGetController } from '$lib/server/interface/adapters/controllers/groups/get.js'
export const load = async ({ locals }) => {
	const [u_err, user] = await userGetMeController({
		configuration: locals.configuration,
		session: locals.session
	})
	if (u_err !== null) {
		console.log(u_err)
		error(500, { message: u_err.reason, id: u_err.reason })
	}
	const [u_errs, users] = await usersGetController({
		configuration: locals.configuration,
		session: locals.session
	})
	if (u_errs !== null) {
		console.log(u_errs)
		error(500, { message: u_errs.reason, id: u_errs.reason })
	}
	const [g_errs, groups] = await groupsGetController({
		configuration: locals.configuration,
		session: locals.session
	})
	if (g_errs !== null) {
		console.log(g_errs)
		error(500, { message: g_errs.reason, id: g_errs.reason })
	}
	return {
		user,
		users,
		groups,
		answers: null
	}
}

export const actions = {
	create: async ({ request, locals }) => {
		const form = await request.formData()
		const user = await userCreateController({
			configuration: locals.configuration,
			session: locals.session,
			payload: { status: form.get('status') }
		})
		return {
			message: `User created`,
			user
		}
	},
	add_group: async ({ request, fetch }) => {
		const form = await request.formData()
		const relationship = {
			namespace: 'Group',
			object: formGetStringOrUndefined({ form, field: 'object' }),
			relation: 'members',
			subject_id: formGetStringOrUndefined({ form, field: 'subject_id' })
		}
		const res = await fetch(`/api/v1/permissions/Group`, {
			method: 'POST',
			body: JSON.stringify(relationship)
		})

		if (res.ok) {
			return {
				message: `Added user to group ${relationship.object}`
			}
		}
		const error = await res.json()
		return fail(res.status, { message: error.message })
	},
	remove_group: async ({ request, fetch }) => {
		const form = await request.formData()
		const relationship = {
			namespace: 'Group',
			object: formGetStringOrUndefined({ form, field: 'object' }),
			relation: 'members',
			subject_id: formGetStringOrUndefined({ form, field: 'subject_id' })
		}
		const res = await fetch(`/api/v1/permissions/Group`, {
			method: 'DELETE',
			body: JSON.stringify(relationship)
		})

		if (res.ok) {
			return {
				message: `Removed user from group ${relationship.object}`
			}
		}
		const error = await res.json()
		return fail(res.status, { message: error.message })
		// return fail(res.status, { message: res.statusText })
	},
	edit_user_groups: async ({ locals, request }) => {
		await authorise({
			namespace: 'Endpoint',
			object: '/api/v1/users',
			relation: 'POST',
			session: locals.session
		})
		if (!locals.session) {
			return fail(401, { message: 'Unauthorised' })
		}
		const form = await request.formData()
		const roles = JSON.parse(String(form.get('roles')))
		log.debug(roles[0])
		const exists = await ketoRead.getRelationships(roles[0])
		log.debug(exists)
		if (
			exists.relation_tuples?.filter((relation) => relation.subject_id === roles[0].subject_id)
				.length === 0
		) {
			log.debug(roles[0])
			const create = await ketoWrite.createRelationship({ createRelationshipBody: roles[0] })
			log.debug(create)
		}
		return {
			message: 'ok'
		}
	},
	delete: async ({ request, fetch }) => {
		const form = await request.formData()
		const id = form.get('id')
		if (typeof id === 'string') {
			const res = await fetch(`/api/v1/users/${id}`, { method: 'DELETE' })
			const data = await res.json()
			return {
				message: data.message
			}
		}
		return fail(400, { message: 'Provide a valid id' })
	}
}

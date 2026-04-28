import { error, fail } from '@sveltejs/kit'
import { log } from '$lib/utils/server/logger.js'
import { authorise, ketoRead, ketoWrite } from '$lib/utils/auth/index.js'
import { formGetStringOrUndefined } from '$lib/utils/forms/index.js'
import { get } from '$lib/utils/ckan/ckan.js'
import { AUTH_GROUPS } from '$lib/globals/auth.js'
import type { LinkPagination } from '$lib/types/ory/kratos/index.js'
import { answers, type Answer } from '$lib/server/entities/models/questions.js'
import { userCreateController } from '$lib/server/interface/adapters/controllers/users/create.js'
import {
	userGetController,
	userGetMeController,
	usersGetController
} from '$lib/server/interface/adapters/controllers/users/get.js'
import { groupsGetController } from '$lib/server/interface/adapters/controllers/groups/get.js'
export const load = async ({ locals, fetch, url }) => {
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
	// await authorise({
	// 	namespace: 'Endpoint',
	// 	object: '/api/v1/users',
	// 	relation: 'GET',
	// 	session: locals.session
	// })
	// const built_url = new URL(`https://127.0.0.1/api/v1/users`)
	// const page_size = url.searchParams.get('page_size') ?? '10'
	// const page_token = url.searchParams.get('page_token')
	// if (page_size) built_url.searchParams.append('page_size', page_size)
	// if (page_token) built_url.searchParams.append('page_token', page_token)
	// const res = await fetch(built_url.pathname + built_url.search)
	// const users = (await res.json()) as LinkPagination & {
	// 	items: { first_name: string; last_name: string; id: string; email: string; groups: string[] }[]
	// }
	// const edit = url.searchParams.get('edit')
	// let user = null
	// let answers = null
	// if (edit) {
	// 	console.log('ho')
	// 	user = (await fetch(`/api/v1/users/${edit}`).then((res) => res.json())) as {
	// 		first_name: string
	// 		last_name: string
	// 		email: string
	// 		id: string
	// 		preferences: Record<PropertyKey, unknown>
	// 		created_at: string
	// 		updated_at: string
	// 		deleted_at: string
	// 		groups: string[]
	// 	}
	// 	answers = (await fetch(`/api/v1/users/${edit}/answers`).then((res) =>
	// 		res.json()
	// 	)) as (Answer & {
	// 		question: { id: string; title: string; description: string | null } | null
	// 	})[]
	// }
	// const ckan_groups = await locals.ckan.request(get('group_list'))
	// const groups = [...AUTH_GROUPS, ...(ckan_groups.success ? ckan_groups.result : [])]
	// return {
	// 	groups,
	// 	users,
	// 	user,
	// 	answers
	// }
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

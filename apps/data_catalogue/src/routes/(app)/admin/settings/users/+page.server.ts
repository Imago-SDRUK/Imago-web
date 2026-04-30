import { error, fail } from '@sveltejs/kit'
import {
	userGetController,
	userGetMeController,
	usersGetController
} from '$lib/server/interface/adapters/controllers/users/get.js'
import { groupsGetController } from '$lib/server/interface/adapters/controllers/groups/get.js'
import { isItANumber } from '@arturoguzman/art-ui'
import type { User } from '$lib/server/entities/models/users.js'
export const load = async ({ locals, url }) => {
	const page = url.searchParams.get('page')
	const _limit = url.searchParams.get('limit')
	let offset = 0
	let limit = 20
	if (page && _limit) {
		const n = Number(page)
		const l = Number(limit)
		if (isItANumber(l) && !Number.isNaN(l) && l > 0) {
			limit = l
		}
		if (isItANumber(n) && !Number.isNaN(n) && n > 0) {
			offset = (n - 1) * limit
		}
	}

	const [u_errs, users] = await usersGetController({
		configuration: locals.configuration,
		session: locals.session,
		offset: offset,
		limit: limit
	})
	if (u_errs !== null) {
		console.log(u_errs, 'users errors')
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
	let user: (User & { first_name?: string; last_name?: string; email?: string }) | null = null
	const edit = url.searchParams.get('edit')
	if (edit) {
		user = await userGetController({
			configuration: locals.configuration,
			session: locals.session,
			id: edit
		}).then(([errors, user]) => {
			if (errors !== null) {
				error(500, { message: errors.reason, id: errors.reason })
			}
			return user
		})
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
		return {
			message: 'ok'
		}
	},
	add_group: async ({ request, fetch }) => {
		return {
			message: 'ok'
		}
	},
	remove_group: async ({ request, fetch }) => {
		return fail(res.status, { message: error.message })
	},
	edit_user_groups: async ({ locals, request }) => {
		return {
			message: 'ok'
		}
	},
	delete: async ({ request, fetch }) => {
		return fail(400, { message: 'Provide a valid id' })
	}
}

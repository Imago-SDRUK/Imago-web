import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import {
	groupAddUserController,
	groupRemoveUserController,
	groupToggleAutoenrollController
} from '$lib/server/interface/adapters/controllers/groups/update'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const toggleAutoEnroll = form(
	type({ 'autoenroll?': 'boolean', id: 'string' }),
	async ({ autoenroll, id }) => {
		const { locals } = getRequestEvent()

		const [errors, group] = await groupToggleAutoenrollController({
			configuration: locals.configuration,
			id,
			autoenroll: autoenroll ? true : false,
			session: locals.session
		})
		if (errors !== null) {
			return error(500, { message: errors.message ?? errors.reason, id: errors.reason })
		}
		console.log(group)
		return {
			message: `Group autoenroll set to ${group.autoenroll}`
		}
	}
)

export const groupAddUser = form(
	type({ user_id: 'string', group_id: 'string' }),
	async ({ user_id, group_id }) => {
		const { locals } = getRequestEvent()

		const [errors] = await groupAddUserController({
			configuration: locals.configuration,
			session: locals.session,
			data: {
				user_id,
				group_id
			}
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: `User successfully added`
		}
	}
)

export const groupRemoveUser = form(
	type({ user_id: 'string', group_id: 'string' }),
	async ({ user_id, group_id }) => {
		const { locals } = getRequestEvent()

		const [errors] = await groupRemoveUserController({
			configuration: locals.configuration,
			session: locals.session,
			user_id,
			group_id
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: `User successfully added`
		}
	}
)

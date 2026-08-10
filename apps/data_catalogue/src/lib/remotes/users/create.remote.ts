import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { userServiceCreateUserApiTokenController } from '$lib/server/interface/adapters/controllers/users/create'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const userServiceCreateUserApiToken = form(
	type({ name: 'string', id: 'string' }),
	async ({ id, name }) => {
		const { locals } = getRequestEvent()

		const [errors, data] = await userServiceCreateUserApiTokenController({
			configuration: locals.configuration,
			session: locals.session,
			id,
			name
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		console.log(data)
		return data
	}
)

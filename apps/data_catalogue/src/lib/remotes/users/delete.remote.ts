import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { userServiceDeleteUserApiTokenController } from '$lib/server/interface/adapters/controllers/users/delete'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const userServiceDeleteUserApiToken = form(type({ id: 'string' }), async ({ id }) => {
	const { locals } = getRequestEvent()

	const [errors, data] = await userServiceDeleteUserApiTokenController({
		configuration: locals.configuration,
		session: locals.session,
		id
	})
	if (errors !== null) {
		error(...errFmt(errors))
	}
	return data
})

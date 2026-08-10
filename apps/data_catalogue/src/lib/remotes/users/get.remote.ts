import { form, getRequestEvent } from '$app/server'
import { usersSearchController } from '$lib/server/interface/adapters/controllers/users/get'
import { invalid } from '@sveltejs/kit'
import { type } from 'arktype'

export const usersSearch = form(type({ term: 'string' }), async ({ term }) => {
	const { locals } = getRequestEvent()
	const [errors, users] = await usersSearchController({
		configuration: locals.configuration,
		session: locals.session,
		identifier: term
	})
	if (errors !== null) {
		return invalid({ message: errors.reason })
	}
	return users
})

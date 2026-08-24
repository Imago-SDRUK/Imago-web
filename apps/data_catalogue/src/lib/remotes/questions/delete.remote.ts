import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { questionDeleteController } from '$lib/server/interface/adapters/controllers/questions/delete'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const questionDelete = form(type({ id: 'string' }), async ({ id }) => {
	const { locals } = getRequestEvent()
	const [errors, question] = await questionDeleteController({
		session: locals.session,
		configuration: locals.configuration,
		id: id
	})
	if (errors !== null) {
		error(...errFmt(errors))
	}
	return {
		question
	}
})

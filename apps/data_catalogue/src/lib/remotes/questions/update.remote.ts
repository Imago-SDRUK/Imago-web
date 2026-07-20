import { command, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { questionUpdateSortController } from '$lib/server/interface/adapters/controllers/questions/update'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const questionUpdateSort = command(
	type({ sort: 'string', id: 'string' }),
	async ({ sort, id }) => {
		const { locals } = getRequestEvent()
		const [errors, question] = await questionUpdateSortController({
			session: locals.session,
			configuration: locals.configuration,
			sort: sort,
			id: id
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			question
		}
	}
)

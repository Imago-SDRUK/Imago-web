import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { storageUpdateController } from '$lib/server/interface/adapters/controllers/storages/update'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const storageCreate = form(
	type({
		id: 'string',
		'name?': 'string > 1',
		'type?': "'local'| 'azure'",
		'credentials?': 'string'
	}),
	async ({ id, name, type, credentials }) => {
		const { locals } = getRequestEvent()
		const [errors] = await storageUpdateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				type,
				name,
				credentials
			},
			id
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: 'Storage updated'
		}
	}
)

import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { storageDeleteController } from '$lib/server/interface/adapters/controllers/storages/delete'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const storageDelete = form(
	type({
		id: 'string'
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent()
		const [errors] = await storageDeleteController({
			session: locals.session,
			configuration: locals.configuration,
			id
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: 'Storage deleted'
		}
	}
)

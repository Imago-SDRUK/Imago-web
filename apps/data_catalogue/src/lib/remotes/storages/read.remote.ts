import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { storageGetController } from '$lib/server/interface/adapters/controllers/storages/get'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const storageGet = form(
	type({
		id: 'string'
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent()
		const [errors, storage] = await storageGetController({
			id,
			session: locals.session,
			configuration: locals.configuration
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			storage
		}
	}
)

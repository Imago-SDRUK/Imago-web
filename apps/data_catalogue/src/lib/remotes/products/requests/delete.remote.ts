import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { productRequestDeleteController } from '$lib/server/interface/adapters/controllers/products/delete'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const productRequestDelete = form(
	type({
		id: 'string'
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent()
		const [errors] = await productRequestDeleteController({
			session: locals.session,
			configuration: locals.configuration,
			id
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: 'Product deleted'
		}
	}
)

import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { productDeleteController } from '$lib/server/interface/adapters/controllers/products/delete'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const productDelete = form(
	type({
		id: 'string'
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent()
		const [errors] = await productDeleteController({
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

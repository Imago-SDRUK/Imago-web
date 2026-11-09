import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { productOptionGetController } from '$lib/server/interface/adapters/controllers/products/get'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const productOptionGet = form(
	type({
		id: 'string'
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent()
		const [errors, product] = await productOptionGetController({
			id,
			session: locals.session,
			configuration: locals.configuration
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			product
		}
	}
)

import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { productOptionGroupGetController } from '$lib/server/interface/adapters/controllers/products/get'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const productOptionGroupGet = form(
	type({
		id: 'string'
	}),
	async ({ id }) => {
		const { locals } = getRequestEvent()
		const [errors, product] = await productOptionGroupGetController({
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

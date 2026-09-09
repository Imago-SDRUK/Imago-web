import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { productOptionUpdateController } from '$lib/server/interface/adapters/controllers/products/update'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const productOptionUpdate = form(
	type({
		id: 'string',
		'name?': 'string',
		'type?': 'string',
		'value?': 'string'
	}),
	async ({ id, name, type, value }) => {
		const { locals } = getRequestEvent()
		const [errors] = await productOptionUpdateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				type,
				value
			},
			id
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: 'Product updated'
		}
	}
)

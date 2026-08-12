import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { productUpdateController } from '$lib/server/interface/adapters/controllers/products/update'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const productCreate = form(
	type({
		id: 'string',
		'name?': 'string',
		'versions?': 'string[]',
		'years?': 'number[]'
	}),
	async ({ id, name, versions, years }) => {
		const { locals } = getRequestEvent()
		const [errors] = await productUpdateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				versions,
				years
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

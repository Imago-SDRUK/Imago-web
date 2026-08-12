import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'

import { productCreateController } from '$lib/server/interface/adapters/controllers/products/create'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const productCreate = form(
	type({
		name: 'string > 1',
		versions: 'string[]',
		years: 'number[]'
	}),
	async ({ name, versions, years }) => {
		const { locals } = getRequestEvent()
		const [errors] = await productCreateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				versions,
				years
			}
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: 'Product created'
		}
	}
)

import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'

import { productOptionCreateController } from '$lib/server/interface/adapters/controllers/products/create'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const productOptionCreate = form(
	type({
		name: 'string > 1',
		value: 'string',
		group: 'string.uuid'
	}),
	async ({ name, value, group }) => {
		const { locals } = getRequestEvent()
		const [errors] = await productOptionCreateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				value,
				group_id: group
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

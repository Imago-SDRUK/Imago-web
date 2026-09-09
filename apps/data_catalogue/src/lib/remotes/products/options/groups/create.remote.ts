import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'

import { productOptionGroupCreateController } from '$lib/server/interface/adapters/controllers/products/create'
import { nonEmptyString } from '$lib/utils'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const productOptionGroupCreate = form(
	type({
		name: nonEmptyString,
		value: nonEmptyString,
		'required?': 'boolean',
		'multiple?': 'boolean'
	}),
	async ({ name, value, required, multiple }) => {
		const { locals } = getRequestEvent()
		const [errors] = await productOptionGroupCreateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				value,
				required: required ? true : false,
				multiple: multiple ? true : false
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

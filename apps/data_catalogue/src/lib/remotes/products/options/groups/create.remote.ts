import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'

import { productOptionGroupCreateController } from '$lib/server/interface/adapters/controllers/products/create'
import slugify from '@sindresorhus/slugify'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const productOptionGroupCreate = form(
	type({
		name: 'string > 1',
		'required?': 'boolean',
		'multiple?': 'boolean'
	}),
	async ({ name, required, multiple }) => {
		const { locals } = getRequestEvent()
		const [errors] = await productOptionGroupCreateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				value: slugify(name),
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

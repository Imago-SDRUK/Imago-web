import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { productOptionGroupUpdateController } from '$lib/server/interface/adapters/controllers/products/update'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const productOptionGroupUpdate = form(
	type({
		id: 'string',
		'name?': 'string',
		'value?': 'string',
		'required?': 'boolean',
		'multiple?': 'boolean'
	}),
	async ({ id, name, value, required, multiple }) => {
		const { locals } = getRequestEvent()
		const [errors] = await productOptionGroupUpdateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				value,
				required: required ? true : false,
				multiple: multiple ? true : false
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

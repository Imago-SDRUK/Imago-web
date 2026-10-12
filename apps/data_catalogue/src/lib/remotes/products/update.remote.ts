import { form, getRequestEvent } from '$app/server'
import { errFmt, type ErrTypes } from '$lib/server/entities/errors'
import type { ProductsProductOptions } from '$lib/server/entities/models/products'
import {
	productAddOptionController,
	productUpdateController
} from '$lib/server/interface/adapters/controllers/products/update'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const productUpdate = form(
	type({
		id: 'string',
		'name?': 'string',
		'versions?': 'string[]',
		'years?': 'number[]',
		'options?': 'string[]'
	}),
	async ({ id, name, versions, years, options }) => {
		const { locals } = getRequestEvent()
		const [update_errors, product] = await productUpdateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				versions,
				years
			},
			id
		})
		if (update_errors !== null) {
			error(...errFmt(update_errors))
		}
		// const _options = options?.filter(opt => product.)
		// console.log(options)
		const { errors } = await Promise.all(
			options
				?.filter((opt) => opt !== '')
				.map((option) =>
					productAddOptionController({
						session: locals.session,
						configuration: locals.configuration,
						data: {
							product_id: id,
							product_option_id: option
						}
					})
				) ?? []
		).then((res) =>
			res.reduce(
				(acc: { errors: ErrTypes[]; data: ProductsProductOptions[] }, [errors, data]) => {
					if (errors !== null) {
						acc.errors.push(errors)
						return acc
					}
					acc.data.push(data)
					return acc
				},
				{ errors: [], data: [] }
			)
		)
		if (errors.length > 0) {
			error(...errFmt(errors[0]))
		}
		return {
			message: 'Product updated'
		}
	}
)

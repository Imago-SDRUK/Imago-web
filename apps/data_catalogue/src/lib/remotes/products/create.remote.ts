import { form, getRequestEvent } from '$app/server'
import { errFmt, type ErrTypes } from '$lib/server/entities/errors'
import type { ProductsProductOptions } from '$lib/server/entities/models/products'
import { productCreateController } from '$lib/server/interface/adapters/controllers/products/create'
import { productAddOptionController } from '$lib/server/interface/adapters/controllers/products/update'
import { nonEmptyString } from '$lib/utils'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

export const productCreate = form(
	type({
		name: nonEmptyString,
		value: nonEmptyString,
		versions: nonEmptyString.array(),
		years: 'number[] > 0',
		options: nonEmptyString.array()
		// versions:  'string[] > 0',
		// years: 'number[] > 0',
		// options: 'string[]'
	}),
	async ({ name, value, versions, years, options }) => {
		const { locals } = getRequestEvent()
		const [product_errors, product] = await productCreateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				name,
				value,
				versions,
				years
			}
		})

		if (product_errors !== null) {
			error(...errFmt(product_errors))
		}
		const { errors } = await Promise.all(
			options
				.filter((opt) => opt !== '')
				.map((option) =>
					productAddOptionController({
						session: locals.session,
						configuration: locals.configuration,
						data: {
							product_id: product.id,
							product_option_id: option
						}
					})
				)
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
			message: 'Product created'
		}
	}
)

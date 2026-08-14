import { form, getRequestEvent } from '$app/server'
import { productRequestCreateController } from '$lib/server/interface/adapters/controllers/products/create'
import { type } from 'arktype'
const nonEmptyString = type('string').narrow((s, ctx) =>
	s === '' ? ctx.reject({ expected: 'a value (was missing)', actual: '' }) : true
)
export const createPlaygroundRequest = form(
	type({
		data_product: nonEmptyString,
		year: nonEmptyString,
		version: nonEmptyString,
		options: 'string[]'
	}),
	async ({ data_product, year, version, options }) => {
		// TODO: create request, return url or request pipeline and return notification
		console.log({ data_product, year, version, options })
		const { locals } = getRequestEvent()
		const [errors, data] = await productRequestCreateController({
			configuration: locals.configuration,
			session: locals.session,
			data: {
				product_id: data_product,
				options,
				year: Number(year),
				version
			}
		})
		console.log(errors)
		console.log(data)
		return {
			message: 'ok'
		}
	}
)

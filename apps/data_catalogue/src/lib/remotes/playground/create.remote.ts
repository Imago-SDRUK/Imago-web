import { form } from '$app/server'
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
		// TODO: depending on the product, fetch the options and evaluate if at least one of each option type is selected
		console.log({ data_product, year, version, options })
		return {
			message: 'ok'
		}
	}
)

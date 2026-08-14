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
		// TODO: create request, return url or request pipeline and return notification
		console.log({ data_product, year, version, options })
		return {
			message: 'ok'
		}
	}
)

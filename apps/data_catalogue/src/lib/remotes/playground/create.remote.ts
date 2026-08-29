import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { productRequestCreateController } from '$lib/server/interface/adapters/controllers/products/create'
import { nonEmptyString } from '$lib/utils'
import { log } from '$lib/utils/server/logger'
import { error, invalid, redirect } from '@sveltejs/kit'
import { type } from 'arktype'

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
		if (errors !== null) {
			if (errors.reason === 'Invalid Data' && errors.id === 'duplicate') {
				return {
					message: 'You have already requested this data product.'
				}
			}
			return invalid(errFmt(errors)[1])
			// error(...errFmt(errors))
		}
		log.trace(data)
		if (data.status === 'completed') {
			return {
				message: 'Your request is ready to be downloaded'
			}
		}
		return {
			message: `Your request has been submitted`
		}
	}
)

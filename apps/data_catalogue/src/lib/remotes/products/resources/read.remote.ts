import { getRequestEvent, query } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import { productResourceGetDownloadUrlController } from '$lib/server/interface/adapters/controllers/products/get'
import { error, invalid } from '@sveltejs/kit'
import { type } from 'arktype'

export const productResourceGet = query(type({ id: 'string' }), async ({ id }) => {
	const { locals } = getRequestEvent()
	const [errors, data] = await productResourceGetDownloadUrlController({
		configuration: locals.configuration,
		session: locals.session,
		product_request_id: id
	})
	console.log(errors)
	console.log(data)
	if (errors !== null) {
		error(...errFmt(errors))
	}
	return data
})

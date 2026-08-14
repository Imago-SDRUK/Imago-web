import { errFmt } from '$lib/server/entities/errors.js'
import { productRequestsListController } from '$lib/server/interface/adapters/controllers/products/get.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	const [product_requests_errors, product_requests] = await productRequestsListController({
		configuration: locals.configuration,
		session: locals.session,
		limit: 50,
		offset: 0
	})
	console.log(product_requests)
	if (product_requests_errors !== null) {
		error(...errFmt(product_requests_errors))
	}
	return {
		product_requests
	}
}

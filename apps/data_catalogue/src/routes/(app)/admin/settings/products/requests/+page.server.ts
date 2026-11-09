import { errFmt } from '$lib/server/entities/errors.js'
import {
	productRequestGetController,
	productRequestsListController
} from '$lib/server/interface/adapters/controllers/products/get.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
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
	const edit = url.searchParams.get('edit')
	let product_request: Record<string, unknown> | null = null
	if (edit) {
		product_request = await productRequestGetController({
			configuration: locals.configuration,
			session: locals.session,
			id: edit
		}).then(([errors, data]) => {
			if (errors !== null) {
				error(500, { message: errors.reason, id: errors.reason })
			}
			return data
		})
	}
	return {
		product_requests,
		product_request
	}
}

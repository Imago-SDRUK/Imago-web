import { errFmt } from '$lib/server/entities/errors.js'
import {
	productResourceGetByIdWithPipelineController,
	productResourcesListController
} from '$lib/server/interface/adapters/controllers/products/get.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
	const [product_requests_errors, product_requests] = await productResourcesListController({
		configuration: locals.configuration,
		session: locals.session,
		limit: 50,
		offset: 0
	})
	if (product_requests_errors !== null) {
		error(...errFmt(product_requests_errors))
	}
	const edit = url.searchParams.get('edit')
	let resource: Record<string, unknown> | null = null
	if (edit) {
		resource = await productResourceGetByIdWithPipelineController({
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
		resource
	}
}

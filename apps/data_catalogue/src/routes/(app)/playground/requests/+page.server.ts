import { errFmt } from '$lib/server/entities/errors'
import { productRequestsListByUserController } from '$lib/server/interface/adapters/controllers/products/get'
import { log } from '$lib/utils/server/logger.js'
import { error } from '@sveltejs/kit'
export const load = async ({ locals }) => {
	const [errors, product_requests] = await productRequestsListByUserController({
		configuration: locals.configuration,
		limit: 50,
		offset: 0,
		session: locals.session
	})
	if (errors !== null) {
		console.log(errors)
		log.error(errors)
		error(...errFmt(errors))
	}
	return {
		product_requests
	}
}

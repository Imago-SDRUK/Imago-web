import { errFmt } from '$lib/server/entities/errors'
import { productsListController } from '$lib/server/interface/adapters/controllers/products/get.js'
import { log } from '$lib/utils/server/logger.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	log.trace('loading playground page')
	const [products_errors, products] = await productsListController({
		configuration: locals.configuration,
		limit: 50,
		offset: 1,
		session: locals.session
	})
	if (products_errors !== null) {
		log.trace(`theres been an issue loading the products`)
		error(...errFmt(products_errors))
	}
	return {
		products
	}
}
// https://svelte.dev/docs/kit/load#Page-data

import { errFmt } from '$lib/server/entities/errors.js'
import {
	type Product,
	type ProductOption,
	type ProductOptionGroup
} from '$lib/server/entities/models/products.js'
import {
	productGetController,
	productOptionGetController,
	productOptionGroupGetController,
	productOptionGroupsListController,
	productOptionsListController,
	productRequestsListController,
	productsListController
} from '$lib/server/interface/adapters/controllers/products/get.js'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
	const [errors, products] = await productsListController({
		configuration: locals.configuration,
		session: locals.session,
		limit: 50,
		offset: 0
	})
	if (errors !== null) {
		error(...errFmt(errors))
	}

	const [product_options_errors, product_options] = await productOptionsListController({
		configuration: locals.configuration,
		session: locals.session,
		limit: 50,
		offset: 0
	})
	if (product_options_errors !== null) {
		error(...errFmt(product_options_errors))
	}

	const [product_option_groups_errors, product_option_groups] =
		await productOptionGroupsListController({
			configuration: locals.configuration,
			session: locals.session,
			limit: 50,
			offset: 0
		})
	if (product_option_groups_errors !== null) {
		error(...errFmt(product_option_groups_errors))
	}

	const [product_requests_errors, product_requests] = await productRequestsListController({
		configuration: locals.configuration,
		session: locals.session,
		limit: 50,
		offset: 0
	})
	if (product_requests_errors !== null) {
		error(...errFmt(product_requests_errors))
	}

	let product: (Product & { options: string[] }) | null = null
	let product_option: ProductOption | null = null
	let product_option_group: ProductOptionGroup | null = null
	const edit_product = url.searchParams.get('edit-product')
	const edit_product_option = url.searchParams.get('edit-product-option')
	const edit_product_option_group = url.searchParams.get('edit-product-option-group')
	if (edit_product) {
		;[product] = await Promise.all([
			productGetController({
				configuration: locals.configuration,
				session: locals.session,
				id: edit_product
			}).then(([errors, data]) => {
				if (errors !== null) {
					console.log(errors)
					error(500, { message: errors.reason, id: errors.reason })
				}
				return data
			})
		])
	}

	if (edit_product_option) {
		;[product_option] = await Promise.all([
			productOptionGetController({
				configuration: locals.configuration,
				session: locals.session,
				id: edit_product_option
			}).then(([errors, data]) => {
				if (errors !== null) {
					console.log(errors)
					error(500, { message: errors.reason, id: errors.reason })
				}
				return data
			})
		])
	}

	if (edit_product_option_group) {
		;[product_option_group] = await Promise.all([
			productOptionGroupGetController({
				configuration: locals.configuration,
				session: locals.session,
				id: edit_product_option_group
			}).then(([errors, data]) => {
				if (errors !== null) {
					console.log(errors)
					error(500, { message: errors.reason, id: errors.reason })
				}
				return data
			})
		])
	}
	return {
		products,
		product_options,
		product_option_groups,
		product_requests,
		product,
		product_option,
		product_option_group
	}
}

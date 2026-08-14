import type { AppContext } from '$lib/server/application/context'
import type { IProductsRepository } from '$lib/server/application/repositories/products'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import {
	product_option_groups,
	product_options,
	product_requests,
	products,
	type ProductInsert,
	type ProductOptionInsert,
	type ProductRequestInsert
} from '$lib/server/entities/models/products'
import { log } from '$lib/utils/server/logger'
import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'
import { options } from 'marked'
import { versions } from 'node:process'

export const productCreateUseCase = async ({
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	data: Partial<ProductInsert>
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'products',
		permits: 'create',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(products)
	const validated = schema({
		...data,
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}

	const [errs_product, result] = await products_repository.createProduct({
		data: validated,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productCreateUseCase' })
	// TODO: create permissions
	// const [errors_p] = await authorisation_module.createPermission({
	// 	namespace: 'Resource',
	// 	object: result.id,
	// 	relation: 'datasets',
	// 	actor: {
	// 		namespace: 'Dataset',
	// 		object: package_id,
	// 		relation: ''
	// 	}
	// })
	// if (errors_p) {
	// 	return err(errors_p)
	// }
	return ok(result)
}

export const productOptionCreateUseCase = async ({
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	data: Partial<ProductOptionInsert>
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'products',
		permits: 'create',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(product_options)
	const validated = schema({
		...data,
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}

	const [errs_product, result] = await products_repository.createProductOption({
		data: validated,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productOptionCreateUseCase' })
	// TODO: create permissions
	// const [errors_p] = await authorisation_module.createPermission({
	// 	namespace: 'Resource',
	// 	object: result.id,
	// 	relation: 'datasets',
	// 	actor: {
	// 		namespace: 'Dataset',
	// 		object: package_id,
	// 		relation: ''
	// 	}
	// })
	// if (errors_p) {
	// 	return err(errors_p)
	// }
	return ok(result)
}

export const productOptionGroupCreateUseCase = async ({
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	data: Partial<ProductOptionInsert>
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'products',
		permits: 'create',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(product_option_groups)
	const validated = schema({
		...data,
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}

	const [errs_product, result] = await products_repository.createProductOptionGroup({
		data: validated,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productOptionCreateUseCase' })
	// TODO: create permissions
	// const [errors_p] = await authorisation_module.createPermission({
	// 	namespace: 'Resource',
	// 	object: result.id,
	// 	relation: 'datasets',
	// 	actor: {
	// 		namespace: 'Dataset',
	// 		object: package_id,
	// 		relation: ''
	// 	}
	// })
	// if (errors_p) {
	// 	return err(errors_p)
	// }
	return ok(result)
}

export const productRequestCreateUseCase = async ({
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	data: Partial<ProductRequestInsert>
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'products',
		permits: 'create',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [product_errors, product] = await products_repository.getProduct({
		id: String(data.product_id)
	})
	if (product_errors !== null) {
		return err(product_errors)
	}
	if (!product.years?.includes(Number(data.year))) {
		return err({
			reason: 'Invalid Data',
			message: `The year ${data.year} that you provided is not valid for this product.`,
			id: 'invalid-year'
		})
	}
	if (!product.versions?.includes(String(data.version))) {
		return err({
			reason: 'Invalid Data',
			message: `The version ${data.version} that you provided is not valid for this product.`,
			id: 'invalid-version'
		})
	}
	const [product_options_errors, product_options] = await products_repository.getProductOptions({
		id: product.id
	})
	if (product_options_errors !== null) {
		return err(product_options_errors)
	}

	// const filtered_user_options = data.options?.filter(user_opt => product_options.some(po => po.options.find(opt => opt.id === user_opt)))

	// eval user option selection against the product options

	const { mapped_data, mapped_errors } = product_options.reduce(
		(
			acc: {
				mapped_errors: ErrTypes[]
				mapped_data: string[]
			},
			el
		) => {
			const found_options =
				data.options?.filter((user_opt) => el.options.find((opt) => opt.id === user_opt)) ?? []
			if (el.required && found_options.length === 0) {
				acc.mapped_errors.push({
					reason: 'Invalid Data',
					message: `You need to provide an option for ${el.group}.`,
					id: 'missing-option'
				})
				return acc
			}
			if (!el.multiple && found_options.length > 1) {
				acc.mapped_errors.push({
					reason: 'Invalid Data',
					message: `${el.group} doesn't accept more than 1 option.`,
					id: 'max-option'
				})
				return acc
			}

			if (el.multiple && found_options.length > el.max_selection) {
				acc.mapped_errors.push({
					reason: 'Invalid Data',
					message: `${el.group} doesn't accept more than ${el.max_selection} options.`,
					id: 'max-option'
				})
				return acc
			}
			if (el.multiple && found_options.length < el.min_selection) {
				acc.mapped_errors.push({
					reason: 'Invalid Data',
					message: `${el.group} doesn't accept less than ${el.min_selection} options.`,
					id: 'max-option'
				})
				return acc
			}
			acc.mapped_data.push(...found_options)
			return acc
		},
		{ mapped_errors: [], mapped_data: [] }
	)

	if (mapped_errors.length > 0) {
		return err(mapped_errors[0])
	}

	const schema = createInsertSchema(product_requests)

	const validated = schema({
		product_id: product.id,
		year: data.year,
		version: data.version,
		options: mapped_data,
		status: 'requested',
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}

	const [errs_product, result] = await products_repository.createProductRequest({
		data: validated,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productRequestCreateUseCase' })
	// TODO: create permissions
	// const [errors_p] = await authorisation_module.createPermission({
	// 	namespace: 'Resource',
	// 	object: result.id,
	// 	relation: 'datasets',
	// 	actor: {
	// 		namespace: 'Dataset',
	// 		object: package_id,
	// 		relation: ''
	// 	}
	// })
	// if (errors_p) {
	// 	return err(errors_p)
	// }
	return ok(result)
}

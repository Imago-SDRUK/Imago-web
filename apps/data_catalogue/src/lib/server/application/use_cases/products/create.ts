import { env } from '$env/dynamic/private'
import type { AppContext } from '$lib/server/application/context'
import type { IProductsRepository } from '$lib/server/application/repositories/products'
import type { IStoragesRepository } from '$lib/server/application/repositories/storages'
import type { IProductResourcesResolver } from '$lib/server/application/resolvers/products'
import type { IStorageResolver } from '$lib/server/application/resolvers/storage'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import {
	product_option_groups,
	product_options,
	product_requests,
	product_resources,
	products,
	type ProductInsert,
	type ProductOptionInsert,
	type ProductRequestInsert,
	type ProductResourceInsert
} from '$lib/server/entities/models/products'
import { log } from '$lib/utils/server/logger'
import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'

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

	// eval user selection to product availability

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
		created_by: session.identity.id,
		updated_by: session.identity.id
	})

	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}

	// check user has not made this requests previously
	const [request_error, request] = await products_repository.getProductRequestByData({
		product_id: validated.product_id,
		year: validated.year,
		version: validated.version,
		options: validated.options ?? [],
		user_id: validated.created_by,
		tx
	})
	if (request_error !== null) {
		return err(request_error)
	}
	if (request.length > 0) {
		return err({
			reason: 'Invalid Data',
			message: `You've already submitted this request`,
			id: 'duplicate'
		})
	}

	// check existing product resources
	const [product_resource_errors, product_resource] =
		await products_repository.getProductResourceByData({
			product_id: validated.product_id,
			year: validated.year,
			version: validated.version,
			options: validated.options ?? [],
			tx
		})
	// if its missing then do not return an error
	if (product_resource_errors !== null && product_resource_errors.reason !== 'Not Found') {
		return err(product_resource_errors)
	}

	const [errs_product, result] = await products_repository.createProductRequest({
		data: {
			...validated,
			status:
				product_resource?.status === 'completed'
					? 'notified'
					: product_resource?.status === 'error'
						? 'error'
						: 'requested'
		},
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

export const productResourceCreateUseCase = async ({
	data,
	storages_repository,
	storage_resolver,
	products_repository,
	session,
	configuration,
	authorisation_module,
	product_resources_resolver,
	tx
}: {
	storages_repository: IStoragesRepository
	storage_resolver: IStorageResolver
	data: Partial<ProductResourceInsert>
	products_repository: IProductsRepository
	product_resources_resolver: IProductResourcesResolver
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

	const schema = createInsertSchema(product_resources)
	const validated = schema({
		// NOTE: data here will be passed directly to schema validation as it will be coming from product request, which has already perfomed the data validations against the db
		...data,
		// get pipeline backend from env variable, could be moved to config
		pipeline_backend: env.PIPELINE_BACKEND,
		// TODO: the created/updated could be removed, otherwise it needs to be created_by/updated_by an internal superuser/bot/etc
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	const [product_resource_errors, product_resource] =
		await products_repository.createProductResource({
			data: validated,
			tx
		})

	if (product_resource_errors !== null) {
		return err(product_resource_errors)
	}

	const [product_service_error, products_service] = await product_resources_resolver.resolve({
		// not from env to avoid wiggly lines
		type: product_resource.pipeline_backend
	})
	if (product_service_error !== null) {
		return err(product_service_error)
	}

	const [product_options_errors, product_options] =
		await products_repository.getProductOptionsWithGroup({
			ids: product_resource.options
		})
	if (product_options_errors !== null) {
		return err(product_options_errors)
	}

	const [product_errors, product] = await products_repository.getProduct({
		id: product_resource.product_id
	})
	if (product_errors !== null) {
		return err(product_errors)
	}

	const [storage_tiles_error, storage_tiles] = await storage_resolver.resolve({
		id: configuration.tiles_storage,
		storages_repository
	})
	if (storage_tiles_error !== null) {
		return err(storage_tiles_error)
	}
	const [storage_geo_error, storage_geo] = await storage_resolver.resolve({
		id: configuration.geographies_storage,
		storages_repository
	})
	if (storage_geo_error !== null) {
		return err(storage_geo_error)
	}
	const [storage_products_error, storage_products] = await storage_resolver.resolve({
		id: configuration.products_storage,
		storages_repository
	})
	if (storage_products_error !== null) {
		return err(storage_products_error)
	}

	const [tiles_token_error, tiles_token] = await storage_tiles.getAuthenticationToken()

	if (tiles_token_error !== null) {
		return err(tiles_token_error)
	}
	const [geo_token_error, geo_token] = await storage_geo.getAuthenticationToken()
	if (geo_token_error !== null) {
		return err(geo_token_error)
	}
	const [products_token_error, products_token] = await storage_products.getAuthenticationToken()
	if (products_token_error !== null) {
		return err(products_token_error)
	}
	const environment_variables = [
		...product_options.map(({ option, group }) => ({ key: group.value, value: option.value })),
		{ key: 'IMAGO_PRODUCT', value: `${product.name}` },
		{ key: 'IMAGO_YEAR', value: `${product_resource.year}` },
		{ key: 'IMAGO_VERSION', value: `${product_resource.version}` },
		{ key: 'IMAGO_DATA_SAS_URL', value: tiles_token },
		{ key: 'IMAGO_GEOGRAPHIES_SAS_URL', value: geo_token },
		{ key: 'IMAGO_OUTPUT_SAS_URL', value: products_token },
		{
			key: 'IMAGO_CALLBACK_URL',
			value: env.SITE_URL.endsWith(`/`)
				? `${env.SITE_URL}api/v1/products/resources/${product_resource.id}`
				: `${env.SITE_URL}/api/v1/products/resources/${product_resource.id}`
		}
	]
	console.log(environment_variables)
	const [pipeline_errors] = await products_service.requestPipeline({
		tx,
		data: {
			// TODO: parse the env variables from the data
			environment_variables,
			id: product_resource.id,
			image: env.PIPELINE_CONTAINER_IMAGE
		}
	})
	if (pipeline_errors !== null) {
		log.error({ error: pipeline_errors, message: `Error requestiong the pipeline` })
		return err(pipeline_errors)
	}
	log.trace({ returning: 'productResourceCreateUseCase' })
	// TODO: derive permissions from product
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
	return ok(product_resource)
}

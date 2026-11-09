import type { AppContext } from '$lib/server/application/context'
import type { IProductsRepository } from '$lib/server/application/repositories/products'
import type { IProductResourcesResolver } from '$lib/server/application/resolvers/products'
import { err, ok } from '$lib/server/entities/errors'
import { log } from '$lib/utils/server/logger'

export const productDeleteUseCase = async ({
	id,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
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
	const [errs_product, result] = await products_repository.deleteProduct({
		id,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productDeleteUseCase' })
	// TODO: either restrict the crud operations to superusers or create Product namespace and add permissions, but products shouldn't be available to non superusers/admins!
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

export const productOptionDeleteUseCase = async ({
	id,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
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
	const [errs_product, result] = await products_repository.deleteProductOption({
		id,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productOptionDeleteUseCase' })
	// TODO: either restrict the crud operations to superusers or create Product namespace and add permissions, but products shouldn't be available to non superusers/admins!
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

export const productOptionGroupDeleteUseCase = async ({
	id,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
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
	const [errs_product, result] = await products_repository.deleteProductOptionGroup({
		id,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productOptionDeleteUseCase' })
	// TODO: either restrict the crud operations to superusers or create Product namespace and add permissions, but products shouldn't be available to non superusers/admins!
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

export const productResourceDeleteUseCase = async ({
	id,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx,
	product_resources_resolver
}: {
	id: string
	product_resources_resolver: IProductResourcesResolver
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
	const [product_service_error, products_service] = await product_resources_resolver.resolve({
		id,
		products_repository
	})
	if (product_service_error !== null) {
		return err(product_service_error)
	}
	const [errs_product, result] = await products_repository.deleteProductResource({
		id,
		tx
	})

	if (errs_product !== null) {
		return err(errs_product)
	}
	const [pipeline_error] = await products_service.deletePipeline({ id })
	if (pipeline_error !== null) {
		return err(pipeline_error)
	}

	log.trace({ returning: 'productDeleteUseCase' })
	// TODO: either restrict the crud operations to superusers or create Product namespace and add permissions, but products shouldn't be available to non superusers/admins!
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

export const productRequestDeleteUseCase = async ({
	id,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
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
	const [errs_product, result] = await products_repository.deleteProductRequest({
		id,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productDeleteUseCase' })
	// TODO: either restrict the crud operations to superusers or create Product namespace and add permissions, but products shouldn't be available to non superusers/admins!
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

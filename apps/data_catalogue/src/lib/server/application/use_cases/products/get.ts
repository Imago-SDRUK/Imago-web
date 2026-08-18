import type { AppContext } from '$lib/server/application/context'
import type { IDownloadsRepository } from '$lib/server/application/repositories/downloads'
import type { IProductsRepository } from '$lib/server/application/repositories/products'
import type { IProductsService } from '$lib/server/application/services/products'
import type { IStorageService } from '$lib/server/application/services/storage'
import { err, ok } from '$lib/server/entities/errors'
import { log } from '$lib/utils/server/logger'

export const productGetUseCase = async ({
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
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.getProduct({
		id,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productGetUseCase' })
	return ok(product)
}

export const productOptionsGetUseCase = async ({
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
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.getProductOptions({
		id,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productOptionsGetUseCase' })
	return ok(product)
}

export const productsListUseCase = async ({
	ids,
	limit,
	offset,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	ids?: string[]
	limit: number
	offset: number
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.listProducts({
		ids,
		limit,
		offset,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productsListUseCase' })
	return ok(product)
}

export const productOptionGetUseCase = async ({
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
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.getProductOption({
		id,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productOptionGetUseCase' })
	return ok(product)
}

export const productOptionsListUseCase = async ({
	ids,
	limit,
	offset,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	ids?: string[]
	limit: number
	offset: number
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.listProductOptions({
		ids,
		limit,
		offset,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productOptionsListUseCase' })
	return ok(product)
}

export const productOptionGroupGetUseCase = async ({
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
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.getProductOptionGroup({
		id,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productGetUseCase' })
	return ok(product)
}

export const productOptionGroupsListUseCase = async ({
	ids,
	limit,
	offset,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	ids?: string[]
	limit: number
	offset: number
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.listProductOptionGroups({
		ids,
		limit,
		offset,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productOptionsListUseCase' })
	return ok(product)
}

export const productRequestsListByUserUseCase = async ({
	limit,
	offset,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	limit: number
	offset: number
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Product namespace if required?
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
	const [errs_product, product_requests] = await products_repository.listProductRequestsByUser({
		user_id: session.identity.id,
		limit,
		offset,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productRequestsListUseCase' })
	return ok(product_requests)
}

export const productRequestsListUseCase = async ({
	ids,
	limit,
	offset,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	ids?: string[]
	limit: number
	offset: number
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.listProductRequests({
		ids,
		limit,
		offset,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productRequestsListUseCase' })
	return ok(product)
}

export const productResourceGetByDataUseCase = async ({
	product_id,
	version,
	year,
	options,
	session,
	products_repository,
	configuration,
	authorisation_module,
	tx
}: {
	product_id: string
	version: string
	year: number
	options: string[]
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.getProductResourceByData({
		product_id,
		version,
		year,
		options,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productRequestsListUseCase' })
	return ok(product)
}

export const productResourceGetDownloadUrlUseCase = async ({
	product_request_id,
	session,
	products_repository,
	storage_service,
	configuration,
	authorisation_module,
	storage_credentials,
	downloads_repository,
	tx
}: {
	product_request_id: string
	products_repository: IProductsRepository
	downloads_repository: IDownloadsRepository
	storage_service: IStorageService
	storage_credentials: Record<string, string>
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Product namespace if required?
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
	if (configuration.products_storage === null) {
		return err({
			reason: 'Invalid Data',
			id: 'missing-storage',
			message: `Product storage is not configured`
		})
	}
	// TODO: get request data
	const [product_request_errors, product_request] = await products_repository.getProductRequest({
		id: product_request_id,
		tx
	})

	if (product_request?.status !== 'notified') {
		return err({
			reason: 'Invalid Data',
			message: `The requested resource is not ready yet`,
			id: 'status-not-notified'
		})
	}

	if (product_request_errors !== null) {
		return err(product_request_errors)
	}

	const [product_resource_errors, product_resource] =
		await products_repository.getProductResourceByData({
			options: product_request.options,
			product_id: product_request.product_id,
			version: product_request.version,
			year: product_request.year,
			tx
		})

	if (product_resource_errors !== null) {
		return err(product_resource_errors)
	}

	if (product_resource.status !== 'completed') {
		return err({
			reason: 'Invalid Data',
			message: `The requested resource is not ready yet`,
			id: 'uncompleted-product-resource'
		})
	}

	if (!product_resource.filename) {
		return err({
			reason: 'Invalid Data',
			message: `The requested resource does not contain a filename`,
			id: 'uncompleted-product-resource'
		})
	}

	const [errors_s, url] = await storage_service.getDownloadUrl({
		filename: product_resource.filename,
		credentials: storage_credentials
	})
	if (errors_s !== null) {
		return err(errors_s)
	}

	const [d_errors] = await downloads_repository.registerDownload({
		data: {
			user: session.identity.id,
			type: 'product',
			resource: product_resource.id
		}
	})
	if (d_errors !== null) {
		log.error({ message: 'Error registering download' })
	}
	return ok(url)

	// fail if status is not notified
	// search product
	// fail if status is not completed
	// get storage info
	// generate dowload url
}

export const productResourcesListUseCase = async ({
	ids,
	limit,
	offset,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	ids?: string[]
	limit: number
	offset: number
	products_repository: IProductsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Product namespace if required?
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
	const [errs_product, product] = await products_repository.listProductResources({
		ids,
		limit,
		offset,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productsListUseCase' })
	return ok(product)
}

export const productResourceGetByIdWithPipelineUseCase = async ({
	id,
	session,
	products_repository,
	products_service,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
	products_repository: IProductsRepository
	products_service: IProductsService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Product namespace if required?
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
	const [product_resource_errors, product_resource] = await products_repository.getProductResource({
		id,
		tx
	})
	if (product_resource_errors !== null) {
		return err(product_resource_errors)
	}

	const [pipeline_error, pipeline] = await products_service.getPipeline({ id: product_resource.id })
	if (pipeline_error !== null && pipeline_error.reason !== 'Not Found') {
		return err(pipeline_error)
	}
	log.trace({ returning: 'productRequestsListUseCase' })
	return ok({ resource: product_resource, pipeline })
}

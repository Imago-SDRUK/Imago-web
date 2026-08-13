import type { AppContext } from '$lib/server/application/context'
import type { IProductsRepository } from '$lib/server/application/repositories/products'
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

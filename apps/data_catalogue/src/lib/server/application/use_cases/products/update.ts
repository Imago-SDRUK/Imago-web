import type { AppContext } from '$lib/server/application/context'
import type { IProductsRepository } from '$lib/server/application/repositories/products'
import { err, ok } from '$lib/server/entities/errors'
import {
	product_option_groups,
	product_options,
	products,
	products_product_options,
	type ProductInsert,
	type ProductsProductOptionsInsert
} from '$lib/server/entities/models/products'
import { log } from '$lib/utils/server/logger'
import { type } from 'arktype'
import { createInsertSchema, createUpdateSchema } from 'drizzle-arktype'

export const productUpdateUseCase = async ({
	id,
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
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
	const schema = createUpdateSchema(products)
	const validated = schema({
		...data,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	const [errs_product, result] = await products_repository.updateProduct({
		id,
		data: validated,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productUpdateUseCase' })
	return ok(result)
}

export const productOptionUpdateUseCase = async ({
	id,
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
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
	const schema = createUpdateSchema(product_options)
	const validated = schema({
		...data,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	const [errs_product, result] = await products_repository.updateProductOption({
		id,
		data: validated,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productUpdateUseCase' })
	return ok(result)
}

export const productAddOptionUseCase = async ({
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	data: Partial<ProductsProductOptionsInsert>
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
	const schema = createInsertSchema(products_product_options)
	const validated = schema({
		...data,
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	const [errs_product, result] = await products_repository.addOptionToProduct({
		data: validated,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productAddOptionUseCase' })
	return ok(result)
}

export const productRemoveOptionUseCase = async ({
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
	data: Partial<ProductsProductOptionsInsert>
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
	const schema = createInsertSchema(products_product_options)
	const validated = schema({
		...data,
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	const [errs_product, result] = await products_repository.removeOptionToProduct({
		data: validated,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productAddOptionUseCase' })
	return ok(result)
}

export const productOptionGroupUpdateUseCase = async ({
	id,
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
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
	const schema = createUpdateSchema(product_option_groups)
	const validated = schema({
		...data,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	const [errs_product, result] = await products_repository.updateProductOptionGroup({
		id,
		data: validated,
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productUpdateUseCase' })
	return ok(result)
}

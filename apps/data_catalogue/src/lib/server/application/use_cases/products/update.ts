import type { AppContext } from '$lib/server/application/context'
import type { IProductsRepository } from '$lib/server/application/repositories/products'
import type { IIdentityService } from '$lib/server/application/services/identity'
import type { INotificationsService } from '$lib/server/application/services/notifications'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import {
	product_option_groups,
	product_options,
	ProductResourceUpdateCompleteSchema,
	ProductResourceUpdateMessageSchema,
	products,
	products_product_options,
	type ProductInsert,
	type ProductResourceUpdateComplete,
	type ProductResourceUpdateMessage,
	type ProductsProductOptionsInsert
} from '$lib/server/entities/models/products'
import { safeJSONParse } from '$lib/utils/forms'
import { log } from '$lib/utils/server/logger'
import { jstr } from '@arturoguzman/art-ui'
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

export const productResourceUpdateMessageUseCase = async ({
	id,
	data,
	products_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
	data: ProductResourceUpdateMessage
	products_repository: IProductsRepository
} & AppContext) => {
	// HACK: LOCAL TESTING, UNCOMMENT BEFORE PRODUCTION
	// const [errors, permission] = await authorisation_module.authorise({
	// 	namespace: 'Action',
	// 	object: 'products',
	// 	permits: 'create',
	// 	actor: session.identity.id,
	// 	configuration
	// })
	// if (errors !== null) {
	// 	return err(errors)
	// }
	// if (!permission.allowed) {
	// 	return err({ reason: 'Unauthorised' })
	// }
	const validated = ProductResourceUpdateMessageSchema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	// being lazy here, can build an update model/engine for drizzle....
	const [product_resource_errors, product_resource] = await products_repository.getProductResource({
		id
	})
	if (product_resource_errors !== null) {
		return err(product_resource_errors)
	}
	let messages = []
	const messages_json = product_resource.messages
	if (Array.isArray(messages_json)) {
		messages = messages_json
	}
	const [errs_product, result] = await products_repository.updateProductResource({
		id,
		data: {
			messages: [...messages, data],
			status: data.status === 'fatal' || data.status === 'error' ? 'error' : 'processing'
		},
		tx
	})
	if (errs_product !== null) {
		return err(errs_product)
	}
	log.trace({ returning: 'productUpdateUseCase' })
	return ok(result)
}

export const productResourceUpdateCompleteUseCase = async ({
	id,
	data,
	products_repository,
	identity_service,
	notifications_service,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
	data: ProductResourceUpdateComplete
	products_repository: IProductsRepository
	identity_service: IIdentityService
	notifications_service: INotificationsService
} & AppContext) => {
	// HACK: LOCAL TESTING, UNCOMMENT BEFORE PRODUCTION
	// const [errors, permission] = await authorisation_module.authorise({
	// 	namespace: 'Action',
	// 	object: 'products',
	// 	permits: 'create',
	// 	actor: session.identity.id,
	// 	configuration
	// })
	// if (errors !== null) {
	// 	return err(errors)
	// }
	// if (!permission.allowed) {
	// 	return err({ reason: 'Unauthorised' })
	// }
	const validated = ProductResourceUpdateCompleteSchema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	// maybe move this to arktype
	const metadata = safeJSONParse(validated.metadata)

	const [product_resource_errors, product_resource] =
		await products_repository.updateProductResource({
			id,
			data: { ...validated, metadata },
			tx
		})
	if (product_resource_errors !== null) {
		console.log(product_resource_errors)
		return err(product_resource_errors)
	}

	log.trace({ message: `getting all product requests` })
	// NOTE: find all product requests that match this product, then notify all users
	const [product_requests_errors, product_requests] =
		await products_repository.getProductRequestByData({
			product_id: product_resource.product_id,
			options: product_resource.options,
			status: 'requested',
			tx,
			version: product_resource.version,
			year: product_resource.year
		})

	if (product_requests_errors !== null) {
		console.log(product_requests_errors)
		return err(product_requests_errors)
	}

	log.trace(product_requests)
	// NOTE: kratos pagination is a bit weird so just launch the promises
	log.trace({ message: `getting all users` })
	const users = await Promise.all(
		product_requests.map(({ created_by, id }) =>
			identity_service.getIdentity({ id: created_by }).then(([errors, data]) => {
				if (errors !== null) {
					return err(errors)
				}
				return ok({ ...data, product_request_id: id })
			})
		)
	).then((res) =>
		res.reduce(
			(
				acc: { first_name: string; last_name: string; email: string; product_request_id: string }[],
				[errors, data]
			) => {
				// TODO: reduce and notify errs to admin, notify valid users
				if (errors) {
					return acc
				}
				if (data) {
					acc.push(data)
				}

				return acc
			},
			[]
		)
	)
	log.trace(users)
	log.trace({ message: `notifying users` })
	const notifications = await Promise.all(
		users.map((user) =>
			notifications_service
				.sendNotification({
					message: `All done for product ${product_resource.id}, cheers ${user.first_name} ${user.last_name}`,
					subject: `Request completed, here's the resource`,
					to: user.email
				})
				.then(([errors, data]) => {
					if (errors !== null) {
						return err(errors)
					}
					if (data.success) {
						products_repository.updateProductRequest({
							id: user.product_request_id,
							tx,
							data: { status: 'notified' }
						})
					}
					return ok(null)
				})
		)
	).then((res) =>
		res.reduce((acc: ErrTypes[], [errors]) => {
			if (errors) {
				acc.push(errors)
			}
			return acc
		}, [])
	)
	if (notifications.length > 0) {
		console.log(jstr(notifications))
		log.error(`There's been an issue sending notifications`)
	}

	log.trace({ returning: 'productResourceUpdateCompleteUseCase' })
	return ok(product_resource)
}

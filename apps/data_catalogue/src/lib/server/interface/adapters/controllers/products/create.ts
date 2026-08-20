import type { Configuration } from '$lib/server/entities/models/configuration'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import { getTransactionModule } from '$lib/server/modules/transaction'
import { getProductRepositoryModule } from '$lib/server/modules/products'
import type {
	ProductInsert,
	ProductOptionGroupInsert,
	ProductOptionInsert,
	ProductRequestInsert
} from '$lib/server/entities/models/products'
import {
	productCreateUseCase,
	productOptionCreateUseCase,
	productOptionGroupCreateUseCase,
	productRequestCreateUseCase,
	productResourceCreateUseCase
} from '$lib/server/application/use_cases/products/create'
import { productResourceGetByDataUseCase } from '$lib/server/application/use_cases/products/get'
import { log } from '$lib/utils/server/logger'
import { getStorageResolverModule } from '$lib/server/application/resolvers/storage'
import { getStorageRepositoryModule } from '$lib/server/modules/storage'
import { getProductResourcesResolver } from '$lib/server/application/resolvers/products'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const productCreateController = async ({
	session,
	data,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	data: Partial<ProductInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productCreateUseCase({
				data,
				products_repository: getProductRepositoryModule(),
				...getServerContext({ session, configuration, tx })
			})
			if (product_errors !== null) {
				return err(product_errors)
			}
			return ok(product)
		}
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(results)
}

export const productOptionCreateController = async ({
	session,
	data,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	data: Partial<ProductOptionInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productOptionCreateUseCase({
				data,
				products_repository: getProductRepositoryModule(),
				...getServerContext({ session, configuration, tx })
			})
			if (product_errors !== null) {
				return err(product_errors)
			}
			return ok(product)
		}
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(results)
}

export const productOptionGroupCreateController = async ({
	session,
	data,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	data: Partial<ProductOptionGroupInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productOptionGroupCreateUseCase({
				data,
				products_repository: getProductRepositoryModule(),
				...getServerContext({ session, configuration, tx })
			})
			if (product_errors !== null) {
				return err(product_errors)
			}
			return ok(product)
		}
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(results)
}

export const productRequestCreateController = async ({
	session,
	data,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	data: Partial<ProductRequestInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	let rollback_error: ErrTypes | null = null
	const tx_service = getTransactionModule()
	// NOTE: to rollback the tx needs to throw an error, otherwhise the requests and products get created
	try {
		const [errors, results] = await tx_service.startTransaction({
			clb: async (tx) => {
				const [product_request_errors, product_request] = await productRequestCreateUseCase({
					data,
					products_repository: getProductRepositoryModule(),
					...getServerContext({ session, configuration, tx })
				})
				if (product_request_errors !== null) {
					log.error({
						caller:
							'productRequestCreateController - productResourceGetByDataUseCase; rolling back',
						errors: product_request_errors
					})
					rollback_error = product_request_errors
					tx.rollback()
					return err(product_request_errors)
				}

				// TODO: evaluate request, check if product resource exists
				// if exists update request
				const [product_resource_errors, product_resource] = await productResourceGetByDataUseCase({
					product_id: product_request.product_id,
					options: product_request.options,
					version: product_request.version,
					year: product_request.year,
					products_repository: getProductRepositoryModule(),
					...getServerContext({ session, configuration, tx })
				})
				if (product_resource_errors !== null) {
					if (product_resource_errors.reason !== 'Not Found') {
						// rolly rolly
						log.error({
							caller:
								'productRequestCreateController - productResourceGetByDataUseCase; rolling back',
							errors: product_resource_errors
						})
						tx.rollback()
						return err(product_resource_errors)
					}
				}

				// create if null
				let resource = product_resource
				if (resource === null) {
					log.trace(`creating product resource`)
					const [product_resource_create_errors, product_resource_create] =
						await productResourceCreateUseCase({
							data: {
								product_id: product_request.product_id,
								options: product_request.options,
								version: product_request.version,
								year: product_request.year
							},
							products_repository: getProductRepositoryModule(),
							storage_resolver: getStorageResolverModule(),
							storages_repository: getStorageRepositoryModule(),
							product_resources_resolver: getProductResourcesResolver(),
							...getServerContext({ session, configuration, tx })
						})
					if (product_resource_create_errors !== null) {
						log.trace('error hit on product resource create')
						log.error({
							caller: 'productRequestCreateController - productResourceCreateUseCase; rolling back',
							errors: product_resource_create_errors
						})
						tx.rollback()
						return err(product_resource_create_errors)
					}
					resource = product_resource_create
				}
				log.trace(`created product resource`)
				if (resource?.status === 'error') {
					// TODO: return notification to user `There's been an issue with this request`, notify team
					return err({
						reason: 'Invalid Data',
						message: `There's been an issue with your request`,
						id: 'resource-error'
					})
				}
				return ok({ request: product_request, status: resource.status, resource: resource.id })
			}
		})
		if (errors !== null) {
			return err(errors)
		}
		return ok(results)
	} catch (_err) {
		console.log(_err)
		return err(
			rollback_error ?? {
				reason: 'Invalid Data',
				message: `There's been an issue with your request`,
				id: 'resource-error'
			}
		)
	}
}

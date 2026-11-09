import type { Configuration } from '$lib/server/entities/models/configuration'
import { err, ok } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import { getTransactionModule } from '$lib/server/modules/transaction'
import { getProductRepositoryModule } from '$lib/server/modules/products'
import type {
	ProductInsert,
	ProductOptionGroupInsert,
	ProductOptionInsert,
	ProductResourceUpdateComplete,
	ProductResourceUpdateMessage,
	ProductsProductOptionsInsert
} from '$lib/server/entities/models/products'
import {
	productAddOptionUseCase,
	productOptionGroupUpdateUseCase,
	productOptionUpdateUseCase,
	productRemoveOptionUseCase,
	productResourceUpdateCompleteUseCase,
	productResourceUpdateMessageUseCase,
	productUpdateUseCase
} from '$lib/server/application/use_cases/products/update'
import { getIdentityModule } from '$lib/server/modules/identity'
import { getNoficationsModule } from '$lib/server/modules/notifications'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const productUpdateController = async ({
	session,
	data,
	configuration,
	id
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
	data: Partial<ProductInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productUpdateUseCase({
				id,
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

export const productOptionUpdateController = async ({
	session,
	data,
	configuration,
	id
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
	data: Partial<ProductOptionInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productOptionUpdateUseCase({
				id,
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

export const productAddOptionController = async ({
	session,
	data,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	data: Partial<ProductsProductOptionsInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productAddOptionUseCase({
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

export const productRemoveOptionController = async ({
	session,
	data,
	configuration,
	id
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
	data: Partial<ProductsProductOptionsInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productRemoveOptionUseCase({
				id,
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

export const productOptionGroupUpdateController = async ({
	session,
	data,
	configuration,
	id
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
	data: Partial<ProductOptionGroupInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productOptionGroupUpdateUseCase({
				id,
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

export const productResourceUpdateController = async ({
	session,
	data,
	configuration,
	id
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
	data: ProductResourceUpdateComplete | ProductResourceUpdateMessage
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			if ('message' in data) {
				const [product_errors, product] = await productResourceUpdateMessageUseCase({
					id,
					data,
					products_repository: getProductRepositoryModule(),
					...getServerContext({ session, configuration, tx })
				})
				if (product_errors !== null) {
					return err(product_errors)
				}
				return ok(product)
			}
			const [product_errors, product] = await productResourceUpdateCompleteUseCase({
				id,
				data,
				products_repository: getProductRepositoryModule(),
				identity_service: getIdentityModule(),
				notifications_service: getNoficationsModule(),
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

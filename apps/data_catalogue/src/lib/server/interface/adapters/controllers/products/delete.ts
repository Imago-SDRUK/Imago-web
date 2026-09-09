import type { Configuration } from '$lib/server/entities/models/configuration'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import { getTransactionModule } from '$lib/server/modules/transaction'
import { getProductRepositoryModule } from '$lib/server/modules/products'
import {
	productDeleteUseCase,
	productOptionDeleteUseCase,
	productOptionGroupDeleteUseCase,
	productRequestDeleteUseCase,
	productResourceDeleteUseCase
} from '$lib/server/application/use_cases/products/delete'
import { getProductResourcesResolver } from '$lib/server/application/resolvers/products'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const productDeleteController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productDeleteUseCase({
				id,
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

export const productOptionDeleteController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productOptionDeleteUseCase({
				id,
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

export const productOptionGroupDeleteController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productOptionGroupDeleteUseCase({
				id,
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

export const productResourceDeleteController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	let error: ErrTypes | null = null
	try {
		const [errors, results] = await tx_service.startTransaction({
			clb: async (tx) => {
				const [product_errors, product] = await productResourceDeleteUseCase({
					id,
					products_repository: getProductRepositoryModule(),
					product_resources_resolver: getProductResourcesResolver(),
					...getServerContext({ session, configuration, tx })
				})
				if (product_errors !== null) {
					error = product_errors
					tx.rollback()
					return err(product_errors)
				}
				return ok(product)
			}
		})
		if (errors !== null) {
			return err(errors)
		}
		return ok(results)
	} catch (_err) {
		console.log(_err)
		return err(error ?? { reason: 'Unexpected', error: _err })
	}
}

export const productRequestDeleteController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productRequestDeleteUseCase({
				id,
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

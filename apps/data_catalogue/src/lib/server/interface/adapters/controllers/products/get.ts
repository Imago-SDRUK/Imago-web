import type { Configuration } from '$lib/server/entities/models/configuration'
import { err, ok } from '$lib/server/entities/errors'
import { getServerContext } from '$lib/server/application/context'
import { getTransactionModule } from '$lib/server/modules/transaction'
import { getProductRepositoryModule } from '$lib/server/modules/products'
import {
	productGetUseCase,
	productOptionGetUseCase,
	productOptionGroupGetUseCase,
	productOptionGroupsListUseCase,
	productOptionsListUseCase,
	productsListUseCase
} from '$lib/server/application/use_cases/products/get'
import { type Product, type ProductOption } from '$lib/server/entities/models/products'

const presenter = ({ product }: { product: Product & { options: ProductOption[] } }) => {
	return {
		...product,
		options: product.options.map((opt) => opt.name).join(`, `)
	}
}

export const productGetController = async ({
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
	const [errors, result] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productGetUseCase({
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
	return ok(presenter({ product: result }))
}

export const productsListController = async ({
	session,
	ids,
	configuration,
	limit,
	offset
}: {
	session: App.Locals['session']
	configuration: Configuration
	ids?: string[]
	limit: number
	offset: number
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productsListUseCase({
				ids,
				limit,
				offset,
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

export const productOptionGetController = async ({
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
			const [product_errors, product] = await productOptionGetUseCase({
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

export const productOptionsListController = async ({
	session,
	ids,
	configuration,
	limit,
	offset
}: {
	session: App.Locals['session']
	configuration: Configuration
	ids?: string[]
	limit: number
	offset: number
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productOptionsListUseCase({
				ids,
				limit,
				offset,
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

export const productOptionGroupGetController = async ({
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
			const [product_errors, product] = await productOptionGroupGetUseCase({
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

export const productOptionGroupsListController = async ({
	session,
	ids,
	configuration,
	limit,
	offset
}: {
	session: App.Locals['session']
	configuration: Configuration
	ids?: string[]
	limit: number
	offset: number
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productOptionGroupsListUseCase({
				ids,
				limit,
				offset,
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

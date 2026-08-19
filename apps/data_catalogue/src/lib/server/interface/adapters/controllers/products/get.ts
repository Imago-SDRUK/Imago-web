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
	productOptionsGetUseCase,
	productOptionsListUseCase,
	productRequestGetUseCase,
	productRequestsListByUserUseCase,
	productRequestsListUseCase,
	productResourceGetByIdWithPipelineUseCase,
	productResourceGetDownloadUrlUseCase,
	productResourcesListUseCase,
	productsListUseCase
} from '$lib/server/application/use_cases/products/get'
import { type Product, type ProductOption } from '$lib/server/entities/models/products'
import { getStorageRepositoryModule } from '$lib/server/modules/storage'
import { storageGetCredentialsAndTypeUseCase } from '$lib/server/application/use_cases/storages/get'
import { getDownloadsModule } from '$lib/server/modules/downloads'
import { getStorageServiceModule } from '$lib/server/modules/storage_service'
import { log } from '$lib/utils/server/logger'
import { getProductsServiceModule } from '$lib/server/modules/products_service'

const presenter = ({ product }: { product: Product & { options: ProductOption[] } }) => {
	return {
		...product,
		options: product.options.map((opt) => opt.id)
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
			log.trace(`call productsListUseCase`)
			const [product_errors, product] = await productsListUseCase({
				ids,
				limit,
				offset,
				products_repository: getProductRepositoryModule(),
				...getServerContext({ session, configuration, tx })
			})
			if (product_errors !== null) {
				log.debug(`error listing the products, productsListController`)
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

export const productGetOptionsController = async ({
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
			const [product_errors, product] = await productOptionsGetUseCase({
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

export const productRequestsListController = async ({
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
			const [product_errors, product] = await productRequestsListUseCase({
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

export const productRequestsListByUserController = async ({
	session,
	configuration,
	limit,
	offset
}: {
	session: App.Locals['session']
	configuration: Configuration
	limit: number
	offset: number
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [product_errors, product] = await productRequestsListByUserUseCase({
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

export const productResourceGetDownloadUrlController = async ({
	product_request_id,
	session,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	product_request_id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [storage_errors, storage_type] = await storageGetCredentialsAndTypeUseCase({
		storages_repository: getStorageRepositoryModule(),
		id: configuration.resources_storage,
		...getServerContext({ session, configuration })
	})
	if (storage_errors !== null) {
		return err(storage_errors)
	}
	const [errors, resource] = await productResourceGetDownloadUrlUseCase({
		product_request_id,
		products_repository: getProductRepositoryModule(),
		downloads_repository: getDownloadsModule(),
		storage_service: getStorageServiceModule(storage_type.type),
		storage_credentials: storage_type.credentials,
		...getServerContext({ session, configuration })
	})
	if (errors) {
		log.error({ controller: 'resourceVersionDownloadController', errors })
		return err(errors)
	}
	return ok(resource)
}

export const productResourcesListController = async ({
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
			const [product_errors, product] = await productResourcesListUseCase({
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

export const productResourceGetByIdWithPipelineController = async ({
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
			const [product_errors, product] = await productResourceGetByIdWithPipelineUseCase({
				id,
				products_repository: getProductRepositoryModule(),
				products_service: getProductsServiceModule(),
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

export const productRequestGetController = async ({
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
			const [product_errors, product] = await productRequestGetUseCase({
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
	return ok(result)
}

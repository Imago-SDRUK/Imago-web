import type { IProductsService } from '$lib/server/application/services/products'
import { productsServiceInfrastructureAzure } from '$lib/server/infrastructure/services/products/azure'
import { productsServiceInfrastructureLocal } from '$lib/server/infrastructure/services/products/local'
import { productsServiceInfrastructureTest } from '$lib/server/infrastructure/services/products/test'

export const productsServiceInfrastructure: {
	azure: IProductsService
	local: IProductsService
	test: IProductsService
} = {
	azure: productsServiceInfrastructureAzure,
	local: productsServiceInfrastructureLocal,
	test: productsServiceInfrastructureTest
}

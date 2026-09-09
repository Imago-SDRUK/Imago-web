import type { IProductsRepository } from '$lib/server/application/repositories/products'
import { drizzleIProductsRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/products/drizzle'
import { testIProductsRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/products/test'

export const productRepositoryInfrastructure: {
	drizzle: IProductsRepository
	test: IProductsRepository
} = {
	test: testIProductsRepositoryInfrastructure,
	drizzle: drizzleIProductsRepositoryInfrastructure
}

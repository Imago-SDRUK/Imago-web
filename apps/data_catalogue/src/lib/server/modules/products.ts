import { env } from '$env/dynamic/private'
import { productRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/products'

export const getProductRepositoryModule = () => {
	if (env.NODE_ENV === 'test') {
		return productRepositoryInfrastructure['test']
	}
	return productRepositoryInfrastructure['drizzle']
}

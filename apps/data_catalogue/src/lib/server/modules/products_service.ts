import { env } from '$env/dynamic/private'
import { productsServiceInfrastructure } from '$lib/server/infrastructure/services/products'

export const getProductsServiceModule = () => {
	if (env.NODE_ENV === 'test') {
		return productsServiceInfrastructure['test']
	}
	if (env.PIPELINE_BACKEND === 'azure') {
		return productsServiceInfrastructure['azure']
	}
	return productsServiceInfrastructure['local']
}

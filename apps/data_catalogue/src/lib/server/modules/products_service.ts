import { productsServiceInfrastructure } from '$lib/server/infrastructure/services/products'

export const getProductsServiceModule = (backend: 'local' | 'azure') => {
	return productsServiceInfrastructure[backend]
}

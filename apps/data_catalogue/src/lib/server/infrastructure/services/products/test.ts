import type { IProductsService } from '$lib/server/application/services/products'

const requestPipeline = async () => {}
const deletePipeline = async () => {}
const getPipeline = async () => {}
export const productsServiceInfrastructureTest: IProductsService = {
	requestPipeline,
	deletePipeline,
	getPipeline
}

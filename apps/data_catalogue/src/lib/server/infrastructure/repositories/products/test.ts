import type { IProductsRepository } from '$lib/server/application/repositories/products'

let mock: string[] = []

// TODO: implement test interface

const createProduct: IProductsRepository['createProduct'] = async () => {}
const deleteProduct: IProductsRepository['deleteProduct'] = async () => {}
const getProduct: IProductsRepository['getProduct'] = async () => {}
const listProducts: IProductsRepository['listProducts'] = async () => {}
const updateProduct: IProductsRepository['updateProduct'] = async () => {}

export const testIProductsRepositoryInfrastructure: IProductsRepository = {
	createProduct,
	deleteProduct,
	getProduct,
	listProducts,
	updateProduct
}

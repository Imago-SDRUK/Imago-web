import type { Transaction } from '$lib/db'
import type { ErrTypes } from '$lib/server/entities/errors'
import type { ProductInsert, Product } from '$lib/server/entities/models/products'

export type IProductsRepository = {
	createProduct: ({
		data
	}: {
		data: ProductInsert
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, Product]>
	getProduct: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, Product]>
	listProducts: ({
		limit,
		offset
	}: {
		ids?: string[]
		limit: number
		offset: number
		tx?: Transaction
	}) => Promise<
		[ErrTypes, null] | [null, { items: Product[]; total: number; offset: number; limit: number }]
	>
	updateProduct: ({
		id
	}: {
		id: string
		data: Partial<ProductInsert>
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, Product]>
	deleteProduct: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, null]>
}

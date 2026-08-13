import type { Transaction } from '$lib/db'
import type { ErrTypes } from '$lib/server/entities/errors'
import type {
	ProductInsert,
	Product,
	ProductOptionInsert,
	ProductOption
} from '$lib/server/entities/models/products'

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
	createProductOption: ({
		data
	}: {
		data: ProductOptionInsert
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, ProductOption]>

	getProductOption: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, ProductOption]>
	listProductOptions: ({
		limit,
		offset
	}: {
		ids?: string[]
		limit: number
		offset: number
		tx?: Transaction
	}) => Promise<
		| [ErrTypes, null]
		| [null, { items: ProductOption[]; total: number; offset: number; limit: number }]
	>
	updateProductOption: ({
		id
	}: {
		id: string
		data: Partial<ProductOptionInsert>
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, ProductOption]>
	deleteProductOption: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, null]>
}

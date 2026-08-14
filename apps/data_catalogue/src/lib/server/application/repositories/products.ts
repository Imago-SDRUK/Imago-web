import type { Transaction } from '$lib/db'
import type { ErrTypes } from '$lib/server/entities/errors'
import type {
	ProductInsert,
	Product,
	ProductOptionInsert,
	ProductOption,
	ProductsProductOptions,
	ProductsProductOptionsInsert,
	ProductOptionGroupInsert,
	ProductOptionGroup,
	ProductRequestInsert,
	ProductRequest
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
	}) => Promise<[ErrTypes, null] | [null, Product & { options: ProductOption[] }]>
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
		| [
				null,
				{
					items: (ProductOption & { group: string | null })[]
					total: number
					offset: number
					limit: number
				}
		  ]
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
	addOptionToProduct: ({
		data
	}: {
		data: ProductsProductOptionsInsert
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, ProductsProductOptions]>
	removeOptionToProduct: ({
		data
	}: {
		data: ProductsProductOptionsInsert
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, null]>
	getProductOptions: ({ id }: { id: string; tx?: Transaction }) => Promise<
		| [ErrTypes, null]
		| [
				null,
				{
					group: string
					group_id: string
					required: boolean
					multiple: boolean
					min_selection: number
					max_selection: number
					options: Partial<ProductOption>[]
				}[]
		  ]
	>
	getProductOptionsByGroup: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, (ProductOptionGroup & { options: ProductOption[] })[]]>

	createProductOptionGroup: ({
		data
	}: {
		data: ProductOptionGroupInsert
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, ProductOptionGroup]>
	getProductOptionGroup: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, ProductOptionGroup]>
	listProductOptionGroups: ({
		limit,
		offset
	}: {
		ids?: string[]
		limit: number
		offset: number
		tx?: Transaction
	}) => Promise<
		| [ErrTypes, null]
		| [null, { items: ProductOptionGroup[]; total: number; offset: number; limit: number }]
	>
	updateProductOptionGroup: ({
		id
	}: {
		id: string
		data: Partial<ProductOptionGroupInsert>
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, ProductOptionGroup]>
	deleteProductOptionGroup: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, null]>
	createProductRequest: ({
		data
	}: {
		data: ProductRequestInsert
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, ProductRequest]>
	listProductRequests: ({
		limit,
		offset
	}: {
		ids?: string[]
		limit: number
		offset: number
		tx?: Transaction
	}) => Promise<
		| [ErrTypes, null]
		| [null, { items: ProductRequest[]; total: number; offset: number; limit: number }]
	>
}

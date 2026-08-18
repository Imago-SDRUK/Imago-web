import type { Transaction } from '$lib/db'
import type { ErrTypes } from '$lib/server/entities/errors'
// import type { ProductPipeline } from '$lib/server/entities/models/products'

export type IProductsService = {
	getPipeline: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, unknown]>
	requestPipeline: ({
		data
	}: {
		data: {
			id: string
			image: string
			resource_group: string
			container_group: string
			environment_variables: { key: string; value: string }[]
		}
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, unknown]>
	deletePipeline: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, null]>
}

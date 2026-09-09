import type { Transaction } from '$lib/db'
import type { ErrTypes } from '$lib/server/entities/errors'
import type { Storage, StorageInsert } from '$lib/server/entities/models/storage'

export type IStoragesRepository = {
	createStorage: ({
		data
	}: {
		data: StorageInsert
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, Storage]>
	getStorage: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, Storage]>
	listStorages: ({
		limit,
		offset
	}: {
		ids?: string[]
		limit: number
		offset: number
		tx?: Transaction
	}) => Promise<
		[ErrTypes, null] | [null, { items: Storage[]; total: number; offset: number; limit: number }]
	>
	updateStorage: ({
		id
	}: {
		id: string
		data: Partial<StorageInsert>
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, Storage]>
	deleteStorage: ({
		id
	}: {
		id: string
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, null]>
}

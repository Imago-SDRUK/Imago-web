import type { ErrTypes } from '$lib/server/entities/errors'
import type { Dataset, DatasetActivity, DatasetRequest } from '$lib/server/entities/models/datasets'

export type DatasetService = {
	getDataset: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, Dataset | null]>
	getDatasetsCount: () => Promise<[ErrTypes, null] | [null, number | null]>
	getDatasetActivity: ({
		id
	}: {
		id: string
		offset: number
		page_size: number
	}) => Promise<[ErrTypes, null] | [null, DatasetActivity[]]>
	getDatasets: ({
		page_size,
		offset
	}: {
		url: URL
		page_size: number
		offset: number
		search?: string
	}) => Promise<
		[ErrTypes, null] | [null, { items: Dataset[]; page_size: number; next: number; total: number }]
	>
	createDataset: ({ data }: { data: DatasetRequest }) => Promise<[ErrTypes, null] | [null, Dataset]>
	updateDataset: ({
		id,
		data
	}: {
		id: string
		data: DatasetRequest
	}) => Promise<[ErrTypes, null] | [null, Dataset]>
	deleteDataset: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
}

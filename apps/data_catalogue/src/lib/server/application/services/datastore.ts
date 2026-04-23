import type { ErrTypes } from '$lib/server/entities/errors'
import type { CSVW } from '$lib/server/entities/models/datastore'

export type DatastoreService = {
	getStructuralMetadata: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, CSVW]>
	setStructuralMetadata: ({
		id
	}: {
		id: string
		metadata: CSVW
	}) => Promise<[ErrTypes, null] | [null, CSVW[]]>
	updateStructuralMetadata: ({
		id
	}: {
		id: string
		metadata: Partial<CSVW>
	}) => Promise<[ErrTypes, null] | [null, CSVW[]]>
}

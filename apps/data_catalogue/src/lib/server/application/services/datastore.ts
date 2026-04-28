import type { ErrTypes } from '$lib/server/entities/errors'
import type { CkanDatastore, CkanDatastoreRequest } from '$lib/server/entities/models/datastore'

export type DatastoreService = {
	getStructuralMetadata: ({
		id
	}: {
		id: string
	}) => Promise<[ErrTypes, null] | [null, CkanDatastore]>
	deleteStructuralMetadata: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
	setStructuralMetadata: ({
		metadata
	}: {
		metadata: CkanDatastoreRequest
	}) => Promise<[ErrTypes, null] | [null, CkanDatastore]>
	updateStructuralMetadata: ({
		id
	}: {
		id: string
		metadata: CkanDatastoreRequest
	}) => Promise<[ErrTypes, null] | [null, CkanDatastore]>
}

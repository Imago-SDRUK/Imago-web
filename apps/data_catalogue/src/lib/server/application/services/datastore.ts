import type { CSVW } from '$lib/server/entities/models/datastore'

export type DatastoreService = {
	getStructuralMetadata: ({ id }: { id: string }) => Promise<CSVW>
	setStructuralMetadata: ({ id }: { id: string; metadata: CSVW }) => Promise<CSVW[]>
	updateStructuralMetadata: ({ id }: { id: string; metadata: Partial<CSVW> }) => Promise<CSVW>
}

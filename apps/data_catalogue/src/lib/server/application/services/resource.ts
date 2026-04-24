import type { ErrTypes } from '$lib/server/entities/errors'
import type {
	ResourceServiceDto,
	ResourceServiceRequest
} from '$lib/server/entities/models/resources'

export type ResourceService = {
	getResource: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, ResourceServiceDto]>
	getResources: ({
		id
	}: {
		id: string
		limit: number
		offset: number
	}) => Promise<[ErrTypes, null] | [null, ResourceServiceDto[]]>
	createResource: ({
		data
	}: {
		data: ResourceServiceRequest
	}) => Promise<[ErrTypes, null] | [null, ResourceServiceDto]>
	deleteResource: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
}

import type {
	ResourceServiceDto,
	ResourceServiceRequest
} from '$lib/server/entities/models/resources'

export type ResourceService = {
	getResource: ({ id }: { id: string }) => Promise<ResourceServiceDto>
	getResources: ({
		id
	}: {
		id: string
		limit: number
		offset: number
	}) => Promise<ResourceServiceDto[]>
	createResource: ({ data }: { data: ResourceServiceRequest }) => Promise<ResourceServiceDto>
	deleteResource: ({ id }: { id: string }) => Promise<void>
}

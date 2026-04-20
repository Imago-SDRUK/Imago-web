import type {
	Resource,
	ResourceRequest,
	ResourceVersion,
	ResourceVersionRequest
} from '$lib/server/entities/models/resources'

export type ResourceRepository = {
	getResource: ({ id }: { id: string }) => Promise<Resource>
	getResources: ({ limit, offset }: { limit: number; offset: number }) => Promise<Resource[]>
	createResource: ({ data }: { data: ResourceRequest }) => Promise<Resource>
	deleteResource: ({ id }: { id: string }) => Promise<void>
	getResourceVersion: ({ id }: { id: string; version: string }) => Promise<ResourceVersion>
	getResourceVersions: ({ id }: { id: string }) => Promise<ResourceVersion[]>
	createResourceVersion: ({ data }: { data: ResourceVersionRequest }) => Promise<ResourceVersion>
	deleteResourceVersion: ({ id }: { id: string }) => Promise<void>
	updateResource: ({
		data,
		id
	}: {
		data: Partial<ResourceRequest>
		id: string
	}) => Promise<Resource>
	updateVersion: ({
		data,
		id
	}: {
		data: Partial<ResourceVersionRequest>
		id: string
	}) => Promise<ResourceVersion>
}

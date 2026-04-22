import type { ErrTypes } from '$lib/server/entities/errors'
import type {
	Resource,
	ResourceRequest,
	ResourceVersion,
	ResourceVersionRequest
} from '$lib/server/entities/models/resources'

export type ResourceRepository = {
	getResource: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, Resource]>
	getResources: ({
		limit,
		offset
	}: {
		limit: number
		offset: number
	}) => Promise<[ErrTypes, null] | [null, Resource[]]>
	createResource: ({
		data
	}: {
		data: ResourceRequest
	}) => Promise<[ErrTypes, null] | [null, Resource]>
	deleteResource: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
	getResourceVersion: ({
		id
	}: {
		id: string
		version: string
	}) => Promise<[ErrTypes, null] | [null, ResourceVersion]>
	getResourceVersions: ({
		id
	}: {
		id: string
	}) => Promise<[ErrTypes, null] | [null, ResourceVersion[]]>
	createResourceVersion: ({
		data
	}: {
		data: ResourceVersionRequest
	}) => Promise<[ErrTypes, null] | [null, ResourceVersion]>
	deleteResourceVersion: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
	updateResource: ({
		data,
		id
	}: {
		data: Partial<ResourceRequest>
		id: string
	}) => Promise<[ErrTypes, null] | [null, Resource]>
	updateVersion: ({
		data,
		id
	}: {
		data: Partial<ResourceVersionRequest>
		id: string
	}) => Promise<[ErrTypes, null] | [null, ResourceVersion]>
}

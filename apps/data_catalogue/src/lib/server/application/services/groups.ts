import type { ErrTypes } from '$lib/server/entities/errors'
import type {
	GroupService,
	GroupServiceRequest,
	GroupServiceUpdateRequest
} from '$lib/server/entities/models/groups'
import type { CkanGroup } from '$lib/types/ckan'

export type GroupsService = {
	createGroup: ({
		data
	}: {
		data: GroupServiceRequest
	}) => Promise<[ErrTypes, null] | [null, GroupService]>
	getGroup: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, GroupService | null]>
	getGroups: ({
		page_size,
		offset
	}: {
		url?: URL
		page_size: number
		offset: number
		search?: string
		include_groups?: boolean
	}) => Promise<[ErrTypes, null] | [null, CkanGroup[] | string[]]>

	updateGroup: ({
		id,
		data
	}: {
		id: string
		data: GroupServiceUpdateRequest
	}) => Promise<[ErrTypes, null] | [null, GroupService]>
	deleteGroup: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
}

import type { Transaction } from '$lib/db'
import type { ErrTypes } from '$lib/server/entities/errors'
import type {
	Group,
	GroupRequest,
	UsersGroups,
	UsersGroupsRequest
} from '$lib/server/entities/models/groups'

export type GroupsRepository = {
	updateGroup: ({
		data,
		id
	}: {
		data: Partial<GroupRequest>
		id: string
	}) => Promise<[ErrTypes, null] | [null, Group | null]>
	createGroup: ({
		data
	}: {
		data: GroupRequest
	}) => Promise<[ErrTypes, null] | [null, Group | null]>
	getGroup: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, Group | null]>

	getGroups: ({
		limit,
		offset
	}: {
		limit: number
		offset: number
	}) => Promise<[ErrTypes, null] | [null, Group[]]>

	getGroupsAutoenroll: () => Promise<[ErrTypes, null] | [null, Group[]]>
	getGroupsById: ({
		ids
	}: {
		ids: string[]
		limit: number
		offset: number
	}) => Promise<[ErrTypes, null] | [null, Group[]]>
	deleteGroup: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
	addDatasetToGroup: ({
		dataset_id,
		id
	}: {
		dataset_id: string
		id: string
	}) => Promise<[ErrTypes, null] | [null, Group | null]>
	removeDatasetFromGroup: ({
		dataset_id,
		id
	}: {
		dataset_id: string
		id: string
	}) => Promise<[ErrTypes, null] | [null, Group | null]>
	addUserToGroup: ({
		data
	}: {
		data: UsersGroupsRequest
		tx?: Transaction
	}) => Promise<[ErrTypes, null] | [null, UsersGroups | null]>
	removeUserFromGroup: ({
		user_id,
		group_id
	}: {
		user_id: string
		group_id: string
	}) => Promise<[ErrTypes, null] | [null, Group | null]>
	getGroupUsers: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, { id: string }[]]>
}

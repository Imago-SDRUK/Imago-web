import type { ErrTypes } from '$lib/server/entities/errors'
import type { UsersGroups, UsersGroupsRequest } from '$lib/server/entities/models/groups'
import type { User, UserRequest } from '$lib/server/entities/models/users'

export type UsersRepository = {
	updateUser: ({
		data,
		id
	}: {
		data: Partial<UserRequest>
		id: string
	}) => Promise<[ErrTypes, null] | [null, User | null]>
	createUser: ({ data }: { data: UserRequest }) => Promise<[ErrTypes, null] | [null, User]>
	getUser: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, User | null]>
	getUsers: ({
		limit,
		offset
	}: {
		limit: number
		offset: number
	}) => Promise<
		[ErrTypes, null] | [null, { items: User[]; total: number; offset: number; limit: number }]
	>
	getUsersById: ({
		ids
	}: {
		ids: string[]
		limit: number
		offset: number
	}) => Promise<
		[ErrTypes, null] | [null, { items: User[]; total: number; offset: number; limit: number }]
	>
	getUserGroups: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, UsersGroups[]]>
	addUserToGroup: ({
		data
	}: {
		data: UsersGroupsRequest
	}) => Promise<[ErrTypes, null] | [null, UsersGroups]>
	removeUserGroup: ({
		data
	}: {
		data: UsersGroupsRequest
	}) => Promise<[ErrTypes, null] | [null, UsersGroups]>
}

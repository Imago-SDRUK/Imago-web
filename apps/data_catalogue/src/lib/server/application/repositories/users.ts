import type { InsightsDateRange } from '$lib/server/entities/models/insights'
import type { ErrTypes } from '$lib/server/entities/errors'
import type { UsersGroups, UsersGroupsRequest } from '$lib/server/entities/models/groups'
import type { User, UserRequest } from '$lib/server/entities/models/users'

export type IUsersRepository = {
	getTotalUsers: (dateRange?: InsightsDateRange) => Promise<[ErrTypes, null] | [null, number]>
	getUsersWithDownloads: (
		dateRange?: InsightsDateRange
	) => Promise<[ErrTypes, null] | [null, number]>
	getUsersByCountry: (
		dateRange?: InsightsDateRange
	) => Promise<[ErrTypes, null] | [null, { country: string; total: number }[]]>
	getUsersByCategory: (
		dateRange?: InsightsDateRange
	) => Promise<[ErrTypes, null] | [null, { category: string; total: number }[]]>
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
	getUserGroups: ({
		id
	}: {
		id: string
	}) => Promise<[ErrTypes, null] | [null, { group: string; group_id: string; user_id: string }[]]>
	addUserToGroup: ({
		data
	}: {
		data: UsersGroupsRequest
	}) => Promise<[ErrTypes, null] | [null, UsersGroups]>
	removeUserGroup: ({
		data
	}: {
		data: {
			user_id: string
			group_id: string
		}
	}) => Promise<[ErrTypes, null] | [null, UsersGroups]>
}

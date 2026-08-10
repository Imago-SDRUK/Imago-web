import type { ErrTypes } from '$lib/server/entities/errors'
import type { UserService, UserServiceApiToken } from '$lib/server/entities/models/users'
// import type { User, UserRequest } from '$lib/server/entities/models/users'

export type IUsersService = {
	getUser: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, UserService]>
	getUsers: () => Promise<
		| [ErrTypes, null]
		| [null, { items: UserService[]; total: number; offset: number; limit: number }]
	>
	getUserApiKeys: ({
		id
	}: {
		id: string
	}) => Promise<[ErrTypes, null] | [null, UserServiceApiToken[]]>
	createApiKey: ({
		id,
		name
	}: {
		id: string
		name: string
	}) => Promise<[ErrTypes, null] | [null, { token: string }]>
	deleteApiKey: ({ id }: { id: string }) => Promise<[ErrTypes, null] | [null, null]>
}

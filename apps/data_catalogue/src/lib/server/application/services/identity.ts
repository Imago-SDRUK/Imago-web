import type { ErrTypes } from '$lib/server/entities/errors'
import type { Session } from '$lib/server/entities/models/identity'
import type { CreateIdentityBody, Identity } from '@ory/client-fetch'

export type IdentityService = {
	// generateUserId: () => string;
	createSuperUser: ({
		data
	}: {
		data: CreateIdentityBody
	}) => Promise<[ErrTypes, null] | [null, Identity]>
	validateSession: ({
		cookie,
		token
	}: {
		cookie: string | undefined
		token: string | null
	}) => Promise<{ session: Session } | { action: 'invalidate' } | { action: 'verify' }>
	getIdentity: ({
		id
	}: {
		id: string
	}) => Promise<
		[ErrTypes, null] | [null, { first_name: string; last_name: string; email: string } | null]
	>
	getIdentities: (request: {
		page_size?: number
		page_token?: string
		identifier?: string
		ids?: string[]
	}) => Promise<
		| [ErrTypes, null]
		| [null, { first_name: string; last_name: string; email: string; id: string }[]]
	>
}

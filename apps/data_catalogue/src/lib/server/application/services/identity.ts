import type { ErrTypes } from '$lib/server/entities/errors'
import type { Session, Identity, CreateIdentityBody } from '$lib/server/entities/models/identity'
import type { IdentityFlow, IdentitySession } from '$lib/utils/auth/types'
// import type { Identity } from '@ory/client-fetch'

type ActionRedirect = {
	action: 'redirect'
	path: string
}

type ActionForm = {
	action: 'form'
	return_to?: string
	form: IdentityFlow['ui']
}

type ActionReset = {
	action: 'reset'
}

type FlowActions = ActionReset | ActionRedirect | ActionForm

export type IIdentityService = {
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
	sessionToToken: ({
		cookie
	}: {
		cookie: string | undefined
	}) => Promise<[ErrTypes, null] | [null, IdentitySession]>
	getIdentity: ({
		id
	}: {
		id: string
	}) => Promise<
		| [ErrTypes, null]
		| [null, { first_name: string; last_name: string; email: string; verified: boolean } | null]
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
	getFlow: ({
		action
	}: {
		action: string
		url: URL
		cookie: string
	}) => Promise<[ErrTypes, null] | [null, FlowActions]>
}

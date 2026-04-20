import type { Session } from '$lib/server/entities/models/identity'

export type AuthenticationService = {
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
	}) => Promise<{ first_name: string; last_name: string; email: string }>
}

import { env } from '$env/dynamic/private'
import type { AuthenticationService } from '$lib/server/application/services/authentication'
import type { IdentitySession } from '$lib/utils/auth/types'
import { log } from '$lib/utils/server/logger'
import { DateTime } from 'luxon'
const validateSession: AuthenticationService['validateSession'] = async ({
	cookie,
	token
}: {
	cookie: string | undefined
	token: string | null
}) => {
	const headers: HeadersInit = {
		Accept: 'application/json'
	}
	if (cookie) {
		headers['Cookie'] = `ory_kratos_session=${cookie}`
	}
	if (token) {
		headers['Authorization'] = token
	}
	const res = await fetch(`${env.IDENTITY_SERVER_PUBLIC}/sessions/whoami`, {
		headers
	})
	const session = (await res.json()) as IdentitySession
	if (!session.active) {
		log.debug('Session is inactive')
		return {
			action: 'invalidate'
		}
	}
	const diff = DateTime.fromISO(session.expires_at).diffNow().milliseconds
	if (diff <= 0) {
		log.debug('Session has expired')
		return {
			action: 'invalidate'
		}
	}

	if (session.error && session.error.code === 401) {
		return {
			action: 'invalidate'
		}
	}

	if (!session.identity.verifiable_addresses.some((va) => va.verified === true)) {
		return {
			action: 'verify'
		}
	}

	return {
		session: {
			id: session.id,
			identity: {
				id: session.identity.id,
				first_name: session.identity.traits.name.first,
				last_name: session.identity.traits.name.last,
				email: session.identity.traits.email
			},
			active: session.active,
			expires_at: session.expires_at,
			verified: session.identity.verifiable_addresses.some((va) => va.verified === true),
			redirect_browser_to: session.redirect_browser_to
		}
	}
}

export const infrastructureServiceAuthenticationKratos: AuthenticationService = {
	validateSession
}

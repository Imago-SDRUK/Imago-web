import { env } from '$env/dynamic/private'
import type { AuthenticationService } from '$lib/server/application/services/authentication'
import type { IdentityService } from '$lib/server/application/services/identity'
import { err, ok } from '$lib/server/entities/errors'
import { kratosRead, kratosWrite } from '$lib/utils/auth'
import type { IdentitySession } from '$lib/utils/auth/types'
import { log } from '$lib/utils/server/logger'
import { DateTime } from 'luxon'

const createSuperUser: IdentityService['createSuperUser'] = async ({ data }) => {
	try {
		const identity = await kratosWrite.createIdentity({ createIdentityBody: data })
		return ok(identity)
	} catch (_err) {
		return err({ reason: 'Unexpected', errors: _err })
	}
}

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

const getIdentity: IdentityService['getIdentity'] = async ({ id }) => {
	try {
		const identity = await kratosRead.getIdentity({ id: id })
		return ok({
			email: identity.traits.email,
			first_name: identity.traits.name.first,
			last_name: identity.traits.name.last
		})
	} catch (_err) {
		if (_err.response.status === 404) {
			return err({ reason: 'Not Found', message: _err.response.statusText, id: id })
		}
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getIdentities: IdentityService['getIdentities'] = async ({
	page_size,
	page_token,
	identifier,
	ids
}) => {
	try {
		const identities = await kratosRead.listIdentities({
			previewCredentialsIdentifierSimilar: identifier,
			pageSize: page_size,
			pageToken: page_token,
			ids: (ids?.length ?? 0 > 0) ? ids : undefined
		})
		return ok(
			identities.map((identity) => ({
				id: identity.id,
				first_name: identity.traits.name.first,
				last_name: identity.traits.name.last,
				email: identity.traits.email
			}))
		)
	} catch (_err) {
		if (_err.response.status === 404) {
			return err({ reason: 'Not Found', message: _err.response.statusText })
		}
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const infrastructureServiceIdentityKratos: IdentityService = {
	validateSession,
	getIdentity,
	getIdentities,
	createSuperUser
}

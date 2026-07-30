import type { IdentitySession } from '$lib/utils/auth/types'
import type { IIdentityService } from '$lib/server/application/services/identity'
import { err, ok } from '$lib/server/entities/errors'
import { handleOryResponse } from '$lib/utils/auth'
import { Configuration, IdentityApi, FrontendApi } from '@ory/client-fetch'
import { log } from '$lib/utils/server/logger'
import { DateTime } from 'luxon'
import { env } from '$env/dynamic/private'

const kratosClient = new FrontendApi(new Configuration({ basePath: env.IDENTITY_SERVER_PUBLIC }))
const kratosRead = new IdentityApi(new Configuration({ basePath: env.IDENTITY_SERVER_ADMIN }))
const kratosWrite = new IdentityApi(new Configuration({ basePath: env.IDENTITY_SERVER_ADMIN }))

const createSuperUser: IIdentityService['createSuperUser'] = async ({ data }) => {
	try {
		const identity = await kratosWrite.createIdentity({ createIdentityBody: data })
		return ok(identity)
	} catch (error) {
		return err({ reason: 'Unexpected', error })
	}
}

const validateSession: IIdentityService['validateSession'] = async ({
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

const getIdentity: IIdentityService['getIdentity'] = async ({ id }) => {
	try {
		const identity = await kratosRead.getIdentity({ id: id })
		return ok({
			email: identity.traits.email,
			first_name: identity.traits.name.first,
			last_name: identity.traits.name.last,
			verified: identity.verifiable_addresses?.some((x) => x.verified) ?? false
		})
	} catch (_err) {
		if (_err.response.status === 404) {
			return err({ reason: 'Not Found', message: _err.response.statusText, id: id })
		}
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getIdentities: IIdentityService['getIdentities'] = async ({
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

const sessionToToken: IIdentityService['sessionToToken'] = async ({
	cookie
}: {
	cookie: string | undefined
}) => {
	const headers: HeadersInit = {
		Accept: 'application/json'
	}
	if (cookie) {
		headers['Cookie'] = `ory_kratos_session=${cookie}`
	}
	const res = await fetch(`${env.IDENTITY_SERVER_PUBLIC}/sessions/whoami?tokenize_as=postgrest`, {
		headers
	})
	const session = (await res.json()) as IdentitySession

	if (!session.active) {
		log.debug('Session is inactive')
		return err({ reason: 'Unauthenticated' })
	}
	const diff = DateTime.fromISO(session.expires_at).diffNow().milliseconds
	if (diff <= 0) {
		log.debug('Session has expired')
		return err({ reason: 'Unauthenticated' })
	}

	if (session.error && session.error.code === 401) {
		return err({ reason: 'Unauthenticated' })
	}

	if (!session.identity.verifiable_addresses.some((va) => va.verified === true)) {
		return err({ reason: 'Unauthenticated' })
	}
	return ok(session)
}

const getFlow: IIdentityService['getFlow'] = async ({ action, url, cookie }) => {
	try {
		const flow_id = url.searchParams.get('flow')
		const return_to = url.searchParams.get('return_to')
		const id = url.searchParams.get('id')

		log.debug({ message: 'Get identity flow', action, flow_id, return_to, id })
		if (flow_id === null && action !== 'logout') {
			log.debug({ message: `Flow id missing` })
			if (return_to === null) {
				return ok({
					action: 'redirect',
					path: `${env.IDENTITY_SERVER_PUBLIC}/self-service/${action}/browser`
				})
			} else {
				return ok({
					action: 'redirect',
					path: `${env.IDENTITY_SERVER_PUBLIC}/self-service/${action}/browser?return_to=${return_to}`
				})
			}
		}
		if (action === 'logout') {
			const f = await kratosClient.createBrowserLogoutFlow({ cookie })
			return ok({
				action: 'redirect',
				path: f.logout_url
			})
		}

		let endpoint = `${env.IDENTITY_SERVER_PUBLIC}/self-service/${action}/flows?id=${flow_id}`
		if (action === 'error') {
			endpoint = `${env.IDENTITY_SERVER_PUBLIC}/self-service/errors?id=${id}`
		}
		const res = await fetch(endpoint, {
			credentials: 'include',
			headers: { cookie }
		})

		const data = await handleOryResponse(res)
		if ('expires_at' in data) {
			/**
			 * NOTE: its fixed to utc + 1, we need to get the timezone from the system
			 **/
			const expires_at = DateTime.fromISO(data.expires_at, { zone: 'utc+1' })
			if (expires_at.diffNow().milliseconds < 0) {
				if (return_to == null) {
					return ok({
						action: 'redirect',
						path: `${env.IDENTITY_SERVER_PUBLIC}/self-service/login/browser`
					})
				} else {
					return ok({
						action: 'redirect',
						path: `${env.IDENTITY_SERVER_PUBLIC}/self-service/login/browser?return_to=${return_to}`
					})
				}
			}
			return ok({
				action: 'form',
				return_to: data.return_to,
				form: data.ui
			})
		}
		if ('logout_url' in data) {
			return ok({
				action: 'redirect',
				path: data.logout_url
			})
		}

		if (data.id === 'custom error') {
			return ok({
				action: 'redirect',
				path: '/'
			})
		}
		if (data.id === 'session_inactive') {
			log.debug('session_inactive')
			return ok({
				action: 'reset'
			})
		}
		if (data.id === 'security_csrf_violation') {
			return ok({
				action: 'reset'
			})
		}
		if (data.id === 'security_identity_mismatch') {
			return ok({
				action: 'reset'
			})
		}
		return ok({
			action: 'reset'
		})
	} catch (error) {
		return err({ reason: 'Unexpected', error })
	}
}

export const infrastructureServiceIdentityKratos: IIdentityService = {
	validateSession,
	getIdentity,
	getIdentities,
	createSuperUser,
	sessionToToken,
	getFlow
}

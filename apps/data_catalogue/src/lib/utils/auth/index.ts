import type { IdentityError, IdentityResponse, IdentitySession } from '$lib/utils/auth/types'
import { log } from '$lib/utils/server/logger.js'
import { error } from '@sveltejs/kit'
import { DateTime } from 'luxon'

export const handleOryResponse = async (response: Response) => {
	const contentType = response.headers.get('content-type')
	if (contentType && contentType.indexOf('application/json') !== -1) {
		return response.json() as Promise<IdentityResponse>
	}
	return response.text().then((text) => ({
		error: {
			id: 'custom error',
			code: response.status,
			status: 'error',
			reason: 'unknown error',
			message: text
		}
	})) as Promise<IdentityError>
}

export const verifyOrySession = (session: IdentitySession) => {
	if (!session.active) {
		return false
	}
	const diff = DateTime.fromISO(session.expires_at).diffNow().milliseconds
	if (diff <= 0) {
		log.debug('session has expired')
		return false
	}
	return true
}

export const checkPermission = async ({
	namespace,
	object,
	relation,
	subject_id
}: {
	namespace: unknown
	object: unknown
	relation: unknown
	subject_id: unknown
}): Promise<boolean> => {
	const url = new URL(`http://127.0.0.1:4466/relation-tuples/check`)
	if (!namespace) return false
	if (!object) return false
	if (!relation) return false
	if (!subject_id) return false
	url.searchParams.append('namespace', String(namespace))
	url.searchParams.append('object', String(object))
	url.searchParams.append('relation', String(relation))
	url.searchParams.append('subject_id', String(subject_id))
	log.debug(url.toString())
	const res = await fetch(url.toString(), {
		method: 'GET'
	})
	const data = (await res.json()) as
		{ allowed: boolean } | { code: number; status: string; message: string }
	if ('allowed' in data) {
		return data.allowed
	}
	return false
}

export const handleKetoError = async (err: { response: Response }) => {
	const _error = await err.response.json()
	log.error(_error)
	error(err.response.status, { message: err.response.statusText, id: 'ory-error' })
}

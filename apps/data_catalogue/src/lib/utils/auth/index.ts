import { env } from '$env/dynamic/private'
import { log } from '$lib/utils/server/logger.js'
import { SERVER_ERRORS } from '$lib/globals/server'
import type { IdentityError, IdentityResponse, IdentitySession } from '$lib/utils/auth/types'
import {
	RelationshipApi,
	Configuration,
	IdentityApi,
	PermissionApi,
	type CheckPermissionRequest
} from '@ory/client-fetch'
import { error } from '@sveltejs/kit'
import { DateTime } from 'luxon'
import type { Session } from '$lib/server/entities/models/identity'

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

export const kratosRead = new IdentityApi(
	new Configuration({ basePath: env.IDENTITY_SERVER_ADMIN })
)
export const kratosWrite = new IdentityApi(
	new Configuration({ basePath: env.IDENTITY_SERVER_ADMIN })
)

export const ketoWrite = new RelationshipApi(
	new Configuration({
		basePath: env.PERMISSION_SERVER_WRITE
	})
)

export const ketoRead = new RelationshipApi(
	new Configuration({
		basePath: env.PERMISSION_SERVER_READ
	})
)

export const ketoCheck = new PermissionApi(
	new Configuration({
		basePath: env.PERMISSION_SERVER_READ
	})
)

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
		| { allowed: boolean }
		| { code: number; status: string; message: string }
	if ('allowed' in data) {
		return data.allowed
	}
	return false
}

export const authorise = async ({
	session,
	namespace,
	object,
	relation,
	subjectSetNamespace,
	subjectSetObject,
	subjectSetRelation,
	action
}: { session?: Session; action?: () => Promise<void> } & CheckPermissionRequest) => {
	if (!session) {
		if (action) {
			action()
		}
		error(...SERVER_ERRORS[401])
	}
	log.trace({
		message: `Evaluating`,
		session,
		namespace,
		object,
		relation,
		subjectSetNamespace,
		subjectSetObject,
		subjectSetRelation
	})
	if (subjectSetNamespace) {
		const permission = await ketoCheck
			.checkPermission({
				namespace,
				object,
				relation,
				subjectSetNamespace,
				subjectSetObject,
				subjectSetRelation
			})
			.catch((err) => {
				log.debug(err)
				return {
					allowed: false
				}
			})
		if (!permission.allowed) {
			if (action) {
				action()
			}
			log.debug(permission)
			error(...SERVER_ERRORS[401])
		}
	}
	const permission = await ketoCheck
		.checkPermission({
			namespace,
			object,
			relation,
			subjectId: session.identity.id
		})
		.catch((err) => {
			log.debug(err)
			return {
				allowed: false
			}
		})
	if (!permission.allowed) {
		if (action) {
			action()
		}
		log.debug(permission)
		error(...SERVER_ERRORS[401])
	}
}

export const handleKetoError = async (err: { response: Response }) => {
	const _error = await err.response.json()
	log.error(_error)
	error(err.response.status, { message: err.response.statusText, id: 'ory-error' })
}

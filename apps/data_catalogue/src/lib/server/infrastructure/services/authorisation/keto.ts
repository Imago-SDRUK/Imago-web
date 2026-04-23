import type { AuthorisationService } from '$lib/server/application/services/autorisation'
import { log } from '$lib/utils/server/logger'
import { error } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'
import { RelationshipApi, Configuration, PermissionApi } from '@ory/client-fetch'
import { err, ok } from '$lib/server/entities/errors'
import type { Permission, Relationship } from '$lib/server/entities/models/permissions'

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

export const handleKetoError = async (err: { response: Response }) => {
	const _error = await err.response.json()
	log.error(_error)
	error(err.response.status, { message: err.response.statusText, id: 'ory-error' })
}

// subject is a 'related in namespace' to object in namespace
// 'Admins (group)' is a admins to /api/v1/users in Endpoints
// 'Editors (group)' is a editors to /api/v1/datasets in Endpoints
// To check the Permits side of things, you need to send the Permits as the Relation in relation-tuples/check
//
//
//
// Set in OPL

const permissionToKeto = ({ namespace, object, permits, actor }: Permission) => {
	if (typeof actor === 'string') {
		return {
			namespace,
			object,
			relation: permits,
			subjectId: actor
		}
	}
	return {
		namespace,
		object,
		relation: permits,
		subjectSetNamespace: actor.namespace,
		subjectSetObject: actor.object,
		subjectSetRelation: actor.relation
	}
}

const permissionToKetoUnderscore = ({
	namespace,
	object,
	permits,
	actor
}: Permission): Relationship => {
	if (typeof actor === 'string') {
		return {
			namespace,
			object: String(object),
			relation: String(permits),
			subject_id: actor
		}
	}
	return {
		namespace,
		object: String(object),
		relation: String(permits),
		subject_set: {
			namespace: actor.namespace,
			object: actor.object,
			relation: actor.relation
		}
	}
}

const authorise: AuthorisationService['authorise'] = async ({
	namespace,
	object,
	permits,
	actor,
	configuration
}) => {
	log.trace({
		message: `Evaluating`,
		namespace,
		object,
		permits,
		actor
	})
	if (
		configuration &&
		configuration.superusers?.includes(typeof actor === 'string' ? actor : actor.object)
	) {
		log.trace({ allowed: true, method: 'superuser' })
		return ok({ allowed: true })
	}
	try {
		const permission = await ketoCheck.checkPermission(
			permissionToKeto({ namespace, object, permits, actor })
		)
		log.trace({ permission })
		return ok(permission)
	} catch (_err) {
		log.trace({ message: 'permissions error', errors: _err })
		return err({ reason: 'Unexpected', errors: _err })
	}
}

const batchAuthorise: AuthorisationService['batchAuthorise'] = async ({ permissions }) => {
	try {
		log.trace({
			message: `Evaluating`,
			permissions
		})
		const payload = permissions.map(permissionToKetoUnderscore)
		const result = await ketoCheck.batchCheckPermission({
			batchCheckPermissionBody: { tuples: payload }
		})
		return ok(result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const createPermission: AuthorisationService['createPermission'] = async ({
	actor,
	object,
	namespace,
	relation
}) => {
	let check_converted = {}
	let body_converted = {}
	if (typeof actor === 'string') {
		check_converted = {
			namespace: namespace,
			relation: relation,
			subjectId: actor,
			object: object
		}
		body_converted = {
			namespace: namespace,
			object: object,
			relation: relation,
			subject_id: actor
		}
	} else {
		check_converted = {
			namespace: namespace,
			relation: relation,
			subjectSetNamespace: actor.namespace,
			subjectSetRelation: actor.relation,
			subjectSetObject: actor.object,
			object: actor.object
		}
		body_converted = {
			namespace: namespace,
			object: object,
			relation: relation,
			subject_set: actor
		}
	}

	const [errors, exists] = await ketoCheck
		.checkPermission(check_converted)
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errors !== null) {
		return err(errors)
	}
	if (!exists.allowed) {
		return await ketoWrite
			.createRelationship({ createRelationshipBody: body_converted })
			.then((res) => ok(res))
			.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	}
	return err({ reason: 'Unexpected' })
}

const createPermissions: AuthorisationService['createPermissions'] = async ({ permissions }) => {
	const parsed = permissions.map(({ namespace, relation, actor, object }) => {
		let body_converted = {}
		if (typeof actor === 'string') {
			body_converted = {
				namespace: namespace,
				object: object,
				relation: relation,
				subject_id: actor
			}
		} else {
			body_converted = {
				namespace: namespace,
				object: object,
				relation: relation,
				subject_set: actor
			}
		}
		return {
			action: 'insert',
			relation_tuple: body_converted
		}
	}) as { action: 'insert'; relation_tuple: Relationship }[]

	try {
		await ketoWrite.patchRelationships({
			relationshipPatch: parsed
		})
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deletePermission: AuthorisationService['deletePermission'] = async ({
	actor,
	object,
	namespace,
	relation
}) => {
	let converted = {}
	if (typeof actor === 'string') {
		converted = {
			namespace: namespace,
			relation: relation,
			subjectId: actor,
			object: object
		}
	} else {
		converted = {
			namespace: namespace,
			relation: relation,
			subjectSetNamespace: actor?.namespace,
			subjectSetRelation: actor?.relation,
			subjectSetObject: actor?.object,
			object: object
		}
	}
	const [errors] = await ketoWrite
		.deleteRelationships(converted)
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errors !== null) {
		return err(errors)
	}
	return ok(null)
}

const getPermissions: AuthorisationService['getPermissions'] = async ({
	namespace,
	permits,
	actor,
	object
}) => {
	let body_converted = {}
	if (typeof actor === 'string') {
		body_converted = {
			namespace: namespace,
			object: object,
			relation: permits,
			subject_id: actor
		}
	} else {
		body_converted = {
			namespace: namespace,
			object: object,
			relation: permits,
			subject_set: actor
		}
	}

	try {
		const permissions = await ketoRead.getRelationships(body_converted)
		return ok(permissions)
	} catch (_err) {
		if (_err.response.status === 404) {
			return err({ reason: 'Not Found', message: _err.response.statusText })
		}
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const authorisationServiceInfrastructureKeto: AuthorisationService = {
	authorise,
	batchAuthorise,
	createPermission,
	// updatePermission,
	deletePermission,
	createPermissions,
	getPermissions
}

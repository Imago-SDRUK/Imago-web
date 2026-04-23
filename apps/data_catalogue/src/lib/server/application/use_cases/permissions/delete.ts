import { err, ok } from '$lib/server/entities/errors'
import {
	PermissionRequestSchema,
	type PermissionRequest
} from '$lib/server/entities/models/permissions'
import { type } from 'arktype'
import type { AppContext } from '$lib/server/application/context'

export const permissionDeleteUseCase = async ({
	data,
	session,
	authorisation_module,
	configuration
}: {
	data: PermissionRequest
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'permissions',
		permits: 'delete',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = PermissionRequestSchema(data)
	if (schema instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: schema.summary, id: 'invalid-data' })
	}
	const [errs, permissions] = await authorisation_module.deletePermission(schema)
	if (errs !== null) {
		return err(errs)
	}
	return ok(permissions)
}

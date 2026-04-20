import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'
import {
	PermissionRequestSchema,
	type PermissionRequest
} from '$lib/server/entities/models/permissions'
import { type } from 'arktype'

export const permissionDeleteUseCase = async ({
	data,
	session
}: {
	data: PermissionRequest
	session: Session
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'permissions',
		permits: 'read'
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
	const [errs, permissions] = await auth_module.deletePermission(schema)
	if (errs !== null) {
		return err(errs)
	}
	return ok(permissions)
}

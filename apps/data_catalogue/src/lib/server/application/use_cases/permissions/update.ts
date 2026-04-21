import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { err, ok } from '$lib/server/entities/errors'
import {
	PermissionRequestSchema,
	type Permission,
	type PermissionRequest
} from '$lib/server/entities/models/permissions'
import { type } from 'arktype'

export const permissionUpdateUseCase = async ({
	data,
	session
}: {
	data: {
		previous: Permission
		new: PermissionRequest
	}
	session: Session
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'permissions',
		permits: 'edit'
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const previous_schema = PermissionRequestSchema(data.previous)
	if (previous_schema instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: previous_schema.summary, id: 'invalid-data' })
	}
	const new_schema = PermissionRequestSchema(data.new)
	if (new_schema instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: new_schema.summary, id: 'invalid-data' })
	}

	if (previous_schema.namespace !== new_schema.namespace) {
		return err({ reason: 'Invalid Data', message: `Permission must be of the same namespace` })
	}
	if (previous_schema.object !== new_schema.object) {
		return err({ reason: 'Invalid Data', message: `Permission must be of the same object` })
	}

	if (previous_schema.actor !== new_schema.actor) {
		return err({ reason: 'Invalid Data', message: `Permission must be of the same actor` })
	}
	const [errs_d] = await auth_module.deletePermission(previous_schema)
	if (errs_d) {
		return err({ reason: 'Unexpected' })
	}

	const [errs, permissions] = await auth_module.createPermission(new_schema)
	if (errs !== null) {
		return err(errs)
	}
	return ok(permissions)
}

import { err, ok } from '$lib/server/entities/errors'
import {
	PermissionRequestSchema,
	type PermissionRequest
} from '$lib/server/entities/models/permissions'
import { ArkErrors, type } from 'arktype'
import type { AppContext } from '$lib/server/application/context'

export const permissionResetNamespaceUseCase = async ({
	namespace,
	session,
	authorisation_module,
	configuration
}: {
	namespace: string
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
	const [errs, permissions] = await authorisation_module.deletePermission({ namespace })
	if (errs !== null) {
		return err(errs)
	}
	return ok(permissions)
}

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

export const permissionsDeleteUseCase = async ({
	data,
	session,
	configuration,
	authorisation_module
}: {
	data: PermissionRequest[]
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		actor: session.identity.id,
		namespace: 'Action',
		object: 'permissions',
		permits: 'create',
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	if (!Array.isArray(data)) {
		return err({
			reason: 'Invalid Data',
			message: 'You need to provide an array',
			id: 'permissions'
		})
	}
	const validated = data
		.map((record) => PermissionRequestSchema(record))
		.reduce(
			(acc, el) => {
				if (el instanceof type.errors) {
					acc.errors.push(el)
					return acc
				}
				acc.data.push(el)
				return acc
			},
			{ errors: [], data: [] } as { errors: ArkErrors[]; data: PermissionRequest[] }
		)
	if (validated.errors.length > 0) {
		return err({ reason: 'Invalid Data', message: validated.errors[0].summary, id: 'arktype' })
	}

	const [errs, permissions] = await authorisation_module.deletePermissions({
		permissions: validated.data
	})
	if (errs !== null) {
		return err(errs)
	}
	return ok(permissions)
}

import { permissionUpdateUseCase } from '$lib/server/application/use_cases/permissions/update'
import { err, ok } from '$lib/server/entities/errors'
import type { Permission, PermissionRequest } from '$lib/server/entities/models/permissions'

export const permissionUpdateController = async ({
	data,
	session
}: {
	data: {
		previous: PermissionRequest
		new: PermissionRequest
	}
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, permissions] = await permissionUpdateUseCase({
		session,
		data
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(permissions)
}

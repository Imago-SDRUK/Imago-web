import { permissionDeleteUseCase } from '$lib/server/application/use_cases/permissions/delete'
import { err, ok } from '$lib/server/entities/errors'
import type { PermissionRequest } from '$lib/server/entities/models/permissions'

export const permissionDeleteController = async ({
	data,
	session
}: {
	data: PermissionRequest
	session: App.Locals['session']
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, permissions] = await permissionDeleteUseCase({
		session,
		data
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(permissions)
}

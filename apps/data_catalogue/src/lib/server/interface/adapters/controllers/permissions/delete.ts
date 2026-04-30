import { getServerContext } from '$lib/server/application/context'
import { permissionDeleteUseCase } from '$lib/server/application/use_cases/permissions/delete'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import type { PermissionRequest } from '$lib/server/entities/models/permissions'

export const permissionDeleteController = async ({
	data,
	session,
	configuration
}: {
	data: PermissionRequest
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, permissions] = await permissionDeleteUseCase({
		data,
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(permissions)
}

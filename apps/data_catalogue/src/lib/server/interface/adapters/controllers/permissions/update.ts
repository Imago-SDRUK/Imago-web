import { getServerContext } from '$lib/server/application/context'
import { permissionUpdateUseCase } from '$lib/server/application/use_cases/permissions/update'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import type { PermissionRequest } from '$lib/server/entities/models/permissions'

export const permissionUpdateController = async ({
	data,
	session,
	configuration
}: {
	data: {
		previous: PermissionRequest
		new: PermissionRequest
	}
	session: App.Locals['session']
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, permissions] = await permissionUpdateUseCase({
		data,
		...getServerContext({ session, configuration })
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(permissions)
}

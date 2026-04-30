import type { AppContext } from '$lib/server/application/context'
import { err, ok } from '$lib/server/entities/errors'

export const actionGetUseCase = async ({
	object,
	permits,
	configuration,
	session,
	authorisation_module
}: {
	object?: string
	permits?: string
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		object,
		permits,
		actor: session.identity.id,
		namespace: 'Action',
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(permission.allowed)
}

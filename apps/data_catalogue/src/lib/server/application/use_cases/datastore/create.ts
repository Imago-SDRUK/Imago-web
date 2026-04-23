import type { AppContext } from '$lib/server/application/context'
import type { DatastoreService } from '$lib/server/application/services/datastore'
import { err, ok } from '$lib/server/entities/errors'
import type { CSVW } from '$lib/server/entities/models/datastore'

export const datastoreCreateUseCase = async ({
	resource_id,
	datastore_service,
	metadata,
	session,
	configuration,
	authorisation_module
}: {
	resource_id: string
	datastore_service: DatastoreService
	metadata: CSVW
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Resource',
		object: resource_id,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	return await datastore_service
		.setStructuralMetadata({ id: resource_id, metadata })
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
}

import type { DatastoreService } from '$lib/server/application/services/datastore'
import { err, ok } from '$lib/server/entities/errors'
import type { CSVW } from '$lib/server/entities/models/datastore'
import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const datastoreUpdateUseCase = async ({
	resource_id,
	datastore_service,
	metadata,
	session
}: {
	resource_id: string
	datastore_service: DatastoreService
	metadata: Partial<CSVW>
	session: Session
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		namespace: 'Resource',
		object: resource_id,
		permits: 'edit',
		actor: session.identity.id
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	return await datastore_service
		.updateStructuralMetadata({ id: resource_id, metadata })
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
}

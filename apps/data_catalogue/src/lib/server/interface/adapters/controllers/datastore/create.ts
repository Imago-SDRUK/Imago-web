import type { Session } from '$lib/server/entities/models/identity'
import { getDatastoreModule } from '$lib/server/modules/datastore'
import { err } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { datastoreCSVWtoCKANCreateUseCase } from '$lib/server/application/use_cases/datastore/create'
import type { CSVW } from '$lib/server/entities/models/datastore'

export const datastoreCreateController = async ({
	resource_id,
	session,
	metadata,
	configuration
}: {
	resource_id?: string
	session?: Session
	metadata?: Record<PropertyKey, unknown> | CSVW
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	if (!resource_id || typeof resource_id !== 'string') {
		return err({ reason: 'Invalid Data', message: `You need to provide a dataset ID`, id: 'no-id' })
	}

	return await datastoreCSVWtoCKANCreateUseCase({
		resource_id,
		datastore_service: getDatastoreModule(),
		metadata,
		...getServerContext({ session, configuration })
	})
}

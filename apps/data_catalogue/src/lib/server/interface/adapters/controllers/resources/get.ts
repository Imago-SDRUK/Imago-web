import { resourceGetUseCase } from '$lib/server/application/use_cases/resources/get'
import { getDatastoreModule } from '$lib/server/modules/datastore'
import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import { getResourceServiceModule } from '$lib/server/modules/resources_service'
import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { log } from '$lib/utils/server/logger'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const resourceGetController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	id: string
	configuration: Configuration
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, resource] = await resourceGetUseCase({
		id,
		datastore_service: getDatastoreModule(),
		resource_respository: getResourceRepositoryModule(),
		resource_service: getResourceServiceModule(),
		...getServerContext({ session, configuration })
	})
	if (errors) {
		log.error({ controller: 'resourceGetController', errors })
		return err(errors)
	}
	return ok(resource)
}

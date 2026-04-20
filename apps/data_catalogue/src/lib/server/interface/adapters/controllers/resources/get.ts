import { resourceGetUseCase } from '$lib/server/application/use_cases/resources/get'
import { getDatastoreModule } from '$lib/server/modules/datastore'
import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import { getResourceServiceModule } from '$lib/server/modules/resources_service'
import { err, ok } from '$lib/server/entities/errors'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const resourceGetController = async ({
	session,
	id
}: {
	session: App.Locals['session']
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const [errors, resource] = await resourceGetUseCase({
		session,
		id,
		datastore_service: getDatastoreModule(),
		resource_respository: getResourceRepositoryModule(),
		resource_service: getResourceServiceModule()
	})
	if (errors) {
		return err(errors)
	}
	return ok(resource)
	// return presenter({ resource })
}

import type { ResourceServiceRequest } from '$lib/server/entities/models/resources'
import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import { resourceCreateUseCase } from '$lib/server/application/use_cases/resources/create'
import { getResourceServiceModule } from '$lib/server/modules/resources_service'
import { err } from '$lib/server/entities/errors'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const resourceCreateController = async ({
	session,
	data
}: {
	session: App.Locals['session']
	data: ResourceServiceRequest
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	return await resourceCreateUseCase({
		session,
		resource_respository: getResourceRepositoryModule(),
		data,
		resource_service: getResourceServiceModule()
	})
	// return presenter({ resource })
}

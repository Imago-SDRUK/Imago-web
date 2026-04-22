import type { ResourceServiceRequest } from '$lib/server/entities/models/resources'
import { getResourceRepositoryModule } from '$lib/server/modules/resources'
import { resourceCreateUseCase } from '$lib/server/application/use_cases/resources/create'
import { getResourceServiceModule } from '$lib/server/modules/resources_service'
import { err } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const resourceCreateController = async ({
	session,
	data,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	data: ResourceServiceRequest
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	return await resourceCreateUseCase({
		resource_respository: getResourceRepositoryModule(),
		data,
		resource_service: getResourceServiceModule(),
		...getServerContext({ session, configuration })
	})
	// return presenter({ resource })
}

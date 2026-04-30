import type { ResourceService } from '$lib/server/application/services/resource'
import { resourceServiceInfrastructureCkan } from '$lib/server/infrastructure/services/resources/ckan'
import { resourceServiceInfrastructureTest } from '$lib/server/infrastructure/services/resources/test'

export const resourceServiceInfrastructure: {
	test: ResourceService
	ckan: ResourceService
} = {
	test: resourceServiceInfrastructureTest,
	ckan: resourceServiceInfrastructureCkan
}

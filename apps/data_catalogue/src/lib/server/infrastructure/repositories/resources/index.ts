import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import { datasetRepositoryInfrastructureDrizzle } from '$lib/server/infrastructure/repositories/resources/drizzle'
import { datasetRepositoryInfrastructureTest } from '$lib/server/infrastructure/repositories/resources/test'

export const resourceRepositoryInfrastructure: {
	test: ResourceRepository
	drizzle: ResourceRepository
} = {
	test: datasetRepositoryInfrastructureTest,
	drizzle: datasetRepositoryInfrastructureDrizzle
}

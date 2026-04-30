import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import { groupRepositoryInfrastructureDrizzle } from '$lib/server/infrastructure/repositories/groups/drizzle'
import { groupRepositoryInfrastructureTest } from '$lib/server/infrastructure/repositories/groups/test'

export const groupRepositoryInfrastructure: {
	drizzle: GroupsRepository
	test: GroupsRepository
} = {
	drizzle: groupRepositoryInfrastructureDrizzle,
	test: groupRepositoryInfrastructureTest
}

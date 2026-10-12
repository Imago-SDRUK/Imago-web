import type { IStoragesRepository } from '$lib/server/application/repositories/storages'
import { drizzleIStoragesRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/storages/drizzle'
import { testIStoragesRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/storages/test'

export const storageRepositoryInfrastructure: {
	drizzle: IStoragesRepository
	test: IStoragesRepository
} = {
	test: testIStoragesRepositoryInfrastructure,
	drizzle: drizzleIStoragesRepositoryInfrastructure
}

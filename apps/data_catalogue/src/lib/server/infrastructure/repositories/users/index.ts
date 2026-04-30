import type { UsersRepository } from '$lib/server/application/repositories/users'
import { userRepositoryInfrastructureDrizzle } from '$lib/server/infrastructure/repositories/users/drizzle'
import { userRepositoryInfrastructureTest } from '$lib/server/infrastructure/repositories/users/test'

export const userRepositoryInfrastructure: {
	drizzle: UsersRepository
	test: UsersRepository
} = {
	drizzle: userRepositoryInfrastructureDrizzle,
	test: userRepositoryInfrastructureTest
}

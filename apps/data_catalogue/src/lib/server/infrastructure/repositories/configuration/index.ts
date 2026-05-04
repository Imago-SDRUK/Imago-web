import type { ConfigurationRepository } from '$lib/server/application/repositories/configuration'
import { configurationRepositoryInfrastructureDrizzle } from '$lib/server/infrastructure/repositories/configuration/drizzle'

export const configurationRepositoryInfrastructure: {
	drizzle: ConfigurationRepository
} = {
	drizzle: configurationRepositoryInfrastructureDrizzle
}

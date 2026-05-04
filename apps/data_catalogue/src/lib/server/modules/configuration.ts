import { env } from '$env/dynamic/private'
import { configurationRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/configuration'

export const getConfigurationModule = () => {
	if (env.NODE_ENV === 'test') {
		return configurationRepositoryInfrastructure['test']
	}
	return configurationRepositoryInfrastructure['drizzle']
}

import { env } from '$env/dynamic/private'
import { resourceRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/resources'

export const getResourceRepositoryModule = () => {
	if (env.NODE_ENV === 'test') {
		return resourceRepositoryInfrastructure['test']
	}
	return resourceRepositoryInfrastructure['drizzle']
}

import { env } from '$env/dynamic/private'
import { storageRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/storages'

export const getStorageRepositoryModule = () => {
	if (env.NODE_ENV === 'test') {
		return storageRepositoryInfrastructure['test']
	}
	return storageRepositoryInfrastructure['drizzle']
}

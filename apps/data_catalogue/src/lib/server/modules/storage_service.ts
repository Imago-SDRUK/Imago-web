import { env } from '$env/dynamic/private'
import { storageServiceInfrastructure } from '$lib/server/infrastructure/services/storage'

export const getStorageServiceModule = (type: 'azure' | 'local') => {
	if (env.NODE_ENV === 'test') {
		return storageServiceInfrastructure['test']
	}
	return storageServiceInfrastructure[type]
}

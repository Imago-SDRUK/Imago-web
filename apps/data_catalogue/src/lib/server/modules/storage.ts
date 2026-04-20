import { env } from '$env/dynamic/private'
import { storageServiceInfrastructure } from '$lib/server/infrastructure/services/storage'

export const getStorageModule = () => {
	if (env.NODE_ENV === 'test') {
		return storageServiceInfrastructure['test']
	}
	return storageServiceInfrastructure['azure']
}

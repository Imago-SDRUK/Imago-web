import type { StorageService } from '$lib/server/application/services/storage'
import { azureStorageServiceInfrastructure } from '$lib/server/infrastructure/services/storage/azure'
import { testStorageServiceInfrastructure } from '$lib/server/infrastructure/services/storage/test'

export const storageServiceInfrastructure: {
	azure: StorageService
	test: StorageService
} = {
	azure: azureStorageServiceInfrastructure,
	test: testStorageServiceInfrastructure
}

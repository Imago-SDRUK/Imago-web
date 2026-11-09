import type { IStorageService } from '$lib/server/application/services/storage'
import { azureIStorageServiceInfrastructure } from '$lib/server/infrastructure/services/storage/azure'
import { localIStorageServiceInfrastructure } from '$lib/server/infrastructure/services/storage/local'
import { testIStorageServiceInfrastructure } from '$lib/server/infrastructure/services/storage/test'

export const storageServiceInfrastructure: {
	azure: ({ credentials }: { credentials: Record<string, string> }) => IStorageService
	local: ({ credentials }: { credentials: Record<string, string> }) => IStorageService
	test: ({ credentials }: { credentials: Record<string, string> }) => IStorageService
} = {
	azure: azureIStorageServiceInfrastructure,
	test: testIStorageServiceInfrastructure,
	local: localIStorageServiceInfrastructure
}

import { storageServiceInfrastructure } from '$lib/server/infrastructure/services/storage'

export const getStorageServiceModule = (
	type: 'azure' | 'local',
	credentials: Record<string, string>
) => {
	return storageServiceInfrastructure[type]({ credentials: credentials })
}

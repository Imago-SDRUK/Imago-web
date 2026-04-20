import type { DatasetService } from '$lib/server/application/services/dataset'
import { infrastructureServiceDatasetCkan } from '$lib/server/infrastructure/services/dataset/ckan'
import { infrastructureServiceDatasetTest } from '$lib/server/infrastructure/services/dataset/test'

export const datasetServiceInfrastructure: {
	ckan: DatasetService
	test: DatasetService
} = {
	ckan: infrastructureServiceDatasetCkan,
	test: infrastructureServiceDatasetTest
}

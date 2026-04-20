import { env } from '$env/dynamic/private'
import { datasetServiceInfrastructure } from '$lib/server/infrastructure/services/dataset'

export const getDatasetModule = () => {
	if (env.NODE_ENV === 'test') {
		return datasetServiceInfrastructure['test']
	}
	return datasetServiceInfrastructure['ckan']
}

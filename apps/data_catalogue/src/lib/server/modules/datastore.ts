import { env } from '$env/dynamic/private'
import { datastoreServiceInfrastructure } from '$lib/server/infrastructure/services/datastore'

export const getDatastoreModule = () => {
	if (env.NODE_ENV === 'test') {
		return datastoreServiceInfrastructure['test']
	}
	return datastoreServiceInfrastructure['ckan']
}

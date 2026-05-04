import type { DatastoreService } from '$lib/server/application/services/datastore'
import { infrastructureServiceDatastoreCkan } from '$lib/server/infrastructure/services/datastore/ckan'
import { infrastructureServiceDatastoreTest } from '$lib/server/infrastructure/services/datastore/test'

export const datastoreServiceInfrastructure: {
	ckan: DatastoreService
	test: DatastoreService
} = {
	ckan: infrastructureServiceDatastoreCkan,
	test: infrastructureServiceDatastoreTest
}

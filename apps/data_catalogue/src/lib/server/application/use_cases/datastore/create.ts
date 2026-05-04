import type { AppContext } from '$lib/server/application/context'
import type { DatastoreService } from '$lib/server/application/services/datastore'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import { CkanDatastore, CSVW } from '$lib/server/entities/models/datastore'
import { csvwToDatastore } from '$lib/server/entities/utils/datastore'
import { type } from 'arktype'

export const datastoreCSVWtoCKANCreateUseCase = async ({
	resource_id,
	datastore_service,
	metadata,
	session,
	configuration,
	authorisation_module
}: {
	resource_id: string
	datastore_service: DatastoreService
	metadata: CSVW
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Resource',
		object: resource_id,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const validated = CSVW(metadata)
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-metadata' })
	}
	const converted = csvwToDatastore({ id: resource_id, csvw: validated, force: true })
	// return ok(converted)
	const results = await Promise.all(
		converted.map((table) => datastore_service.setStructuralMetadata({ metadata: table }))
	)

	const { datastore_errors, datastore } = results.reduce(
		(acc, [errors, data]) => {
			if (errors !== null) {
				acc.datastore_errors.push(errors)
			}
			if (data !== null) {
				acc.datastore.push(data)
			}
			return acc
		},
		{ datastore_errors: [], datastore: [] } as {
			datastore_errors: ErrTypes[]
			datastore: CkanDatastore[]
		}
	)
	// const record = csvwToDatastore({
	// 	id: id,
	// 	csvw: metadata,
	// 	force: true
	// 	// delete_fields: true
	// })
	// const result = await Promise.all(
	// 	record.map(async (table) => {
	// 		return ckan.request(create('datastore_create', table))
	// 	})
	// )
	// const { errors, data } = result.reduce(
	// 	(acc, res) => {
	// 		if (!res.success) {
	// 			acc.errors.push(handleCkanError(res))
	// 			return acc
	// 		}
	// 		acc.data.push(datastoreToCsvw(res.result))
	// 		return acc
	// 	},
	// 	{ errors: [], data: [] } as { errors: ErrTypes[]; data: CSVW[] }
	// )
	// if (errors.length > 0) {
	// 	return err(errors[0])
	// }
	if (datastore_errors.length > 0) {
		return err(datastore_errors[0])
	}
	return ok(datastore)
}

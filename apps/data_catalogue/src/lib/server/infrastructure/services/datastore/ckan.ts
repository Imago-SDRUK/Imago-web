import type { DatastoreService } from '$lib/server/application/services/datastore'
import { env } from '$env/dynamic/private'
import { err, ok } from '$lib/server/entities/errors'
import { handleCkanError } from '$lib/server/infrastructure/utils/services/ckan'
import { create, createCkanClient, get, remove } from '$lib/utils/ckan/ckan'

const getStructuralMetadata: DatastoreService['getStructuralMetadata'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(get('datastore_info', { resource_id: id }))
		if (!res.success) {
			return err(handleCkanError(res))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const setStructuralMetadata: DatastoreService['setStructuralMetadata'] = async ({ metadata }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})

		const data = await ckan.request(create('datastore_create', metadata))
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
		if (!data.success) {
			return err(handleCkanError(data))
		}
		return ok(data.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

// TODO: evaluate update process as there is no easy way to update previous data without overriding the whole row
const updateStructuralMetadata: DatastoreService['updateStructuralMetadata'] = async ({
	metadata
}) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})

		const data = await ckan.request(create('datastore_create', metadata))
		// const record = csvwToDatastore({
		// 	id: id,
		// 	csvw: metadata,
		// 	force: true,
		// 	delete_fields: true
		// })
		// const result = await Promise.all(
		// 	record.map(async (table) => {
		// return ckan.request(create('datastore_create', table))
		// 	})
		// )
		//
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
		if (!data.success) {
			return err(handleCkanError(data))
		}

		return ok(data.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deleteStructuralMetadata: DatastoreService['deleteStructuralMetadata'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(remove('datastore_delete', { resource_id: id }))
		if (!res.success) {
			return err(handleCkanError(res))
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
export const infrastructureServiceDatastoreCkan: DatastoreService = {
	getStructuralMetadata,
	setStructuralMetadata,
	updateStructuralMetadata,
	deleteStructuralMetadata
}

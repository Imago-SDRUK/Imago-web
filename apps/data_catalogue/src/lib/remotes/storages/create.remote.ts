import { form, getRequestEvent } from '$app/server'
import { errFmt } from '$lib/server/entities/errors'
import {
	StorageAzureredentialsSchema,
	StorageLocalCredentialsSchema
} from '$lib/server/entities/models/storage'
import { storageCreateController } from '$lib/server/interface/adapters/controllers/storages/create'
import { error } from '@sveltejs/kit'
import { type } from 'arktype'

// import { createInsertSchema } from 'drizzle-arktype'
export const storageCreate = form(
	type({
		name: 'string > 1',
		type: "'local'| 'azure'",
		credentials: type.or(StorageLocalCredentialsSchema, StorageAzureredentialsSchema)
	}),
	async ({ name, type, credentials }) => {
		const { locals } = getRequestEvent()
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// console.log(credentials)
		// return {
		// 	message: 'ok'
		// }
		const [errors] = await storageCreateController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				type,
				name,
				credentials
			}
		})
		if (errors !== null) {
			error(...errFmt(errors))
		}
		return {
			message: 'Storage created'
		}
	}
)

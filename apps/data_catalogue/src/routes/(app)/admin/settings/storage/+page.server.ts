import { errFmt } from '$lib/server/entities/errors.js'
import type { Storage } from '$lib/server/entities/models/storage.js'
import {
	storageGetController,
	storagesListController
} from '$lib/server/interface/adapters/controllers/storages/get'
import { error } from '@sveltejs/kit'

export const load = async ({ locals, url }) => {
	const [errors, storages] = await storagesListController({
		configuration: locals.configuration,
		limit: 50,
		offset: 0,
		session: locals.session
	})
	if (errors !== null) {
		return error(...errFmt(errors))
	}
	let storage: Storage | null = null
	const edit_storage = url.searchParams.get('edit')
	if (edit_storage) {
		;[storage] = await Promise.all([
			storageGetController({
				configuration: locals.configuration,
				session: locals.session,
				id: edit_storage
			}).then(([errors, data]) => {
				if (errors !== null) {
					console.log(errors)
					error(500, { message: errors.reason, id: errors.reason })
				}
				return data
			})
		])
	}
	return {
		storages,
		storage
	}
}

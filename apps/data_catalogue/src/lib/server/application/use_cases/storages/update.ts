import type { AppContext } from '$lib/server/application/context'
import type { IStoragesRepository } from '$lib/server/application/repositories/storages'
import { err, ok } from '$lib/server/entities/errors'
import { storages, type StorageInsert } from '$lib/server/entities/models/storage'
import { log } from '$lib/utils/server/logger'
import { type } from 'arktype'
import { createUpdateSchema } from 'drizzle-arktype'

export const storageUpdateUseCase = async ({
	id,
	data,
	storages_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
	data: Partial<StorageInsert>
	storages_repository: IStoragesRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'storages',
		permits: 'create',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createUpdateSchema(storages)
	const validated = schema({
		...data,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	const [errs_storage, result] = await storages_repository.updateStorage({
		id,
		data: validated,
		tx
	})
	if (errs_storage !== null) {
		return err(errs_storage)
	}
	log.trace({ returning: 'storageUpdateUseCase' })
	return ok(result)
}

import type { AppContext } from '$lib/server/application/context'
import type { IStoragesRepository } from '$lib/server/application/repositories/storages'
import { err, ok } from '$lib/server/entities/errors'
import { log } from '$lib/utils/server/logger'

export const storageGetUseCase = async ({
	id,
	storages_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	id: string
	storages_repository: IStoragesRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Storage namespace if required?
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
	const [errs_storage, storage] = await storages_repository.getStorage({
		id,
		tx
	})
	if (errs_storage !== null) {
		return err(errs_storage)
	}
	log.trace({ returning: 'storageGetUseCase' })
	return ok(storage)
}

export const storagesListUseCase = async ({
	ids,
	limit,
	offset,
	storages_repository,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	ids?: string[]
	limit: number
	offset: number
	storages_repository: IStoragesRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		// TODO: create Storage namespace if required?
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
	const [errs_storage, storage] = await storages_repository.listStorages({
		ids,
		limit,
		offset,
		tx
	})
	if (errs_storage !== null) {
		return err(errs_storage)
	}
	log.trace({ returning: 'storagesListUseCase' })
	return ok(storage)
}

export const storageGetCredentialsAndTypeUseCase = async ({
	id,
	storages_repository,
	tx
}: {
	id: string | null
	storages_repository: IStoragesRepository
} & AppContext) => {
	if (!id) {
		return err({ reason: 'Unexpected', error: 'missing configuration' })
	}
	const [errs_storage, storage] = await storages_repository.getStorage({
		id,
		tx
	})
	if (errs_storage !== null) {
		return err(errs_storage)
	}
	log.trace({ returning: 'storageGetCredentialsAndTypeUseCase' })
	return ok({ credentials: storage.credentials, type: storage.type })
}

import type { IStoragesRepository } from '$lib/server/application/repositories/storages'
import type { IStorageService } from '$lib/server/application/services/storage'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import { getStorageServiceModule } from '$lib/server/modules/storage_service'

export type IStorageResolver = {
	resolve: ({
		id
	}: {
		id: string
		storages_repository: IStoragesRepository
	}) => Promise<[ErrTypes, null] | [null, IStorageService]>
}

const resolve: IStorageResolver['resolve'] = async ({
	id,
	storages_repository
}: {
	id: string
	storages_repository: IStoragesRepository
}) => {
	const [errors, storage] = await storages_repository.getStorage({ id })
	if (errors !== null) {
		return err(errors)
	}
	return ok(getStorageServiceModule(storage.type, storage.credentials))
}

const storageResolver: IStorageResolver = {
	resolve
}

export const getStorageResolverModule = () => {
	return storageResolver
}

import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { getTransactionModule } from '$lib/server/modules/transaction'
import { getStorageRepositoryModule } from '$lib/server/modules/storage'
import {
	storageGetUseCase,
	storagesListUseCase
} from '$lib/server/application/use_cases/storages/get'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const storageGetController = async ({
	session,
	id,
	configuration
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [storage_errors, storage] = await storageGetUseCase({
				id,
				storages_repository: getStorageRepositoryModule(),
				...getServerContext({ session, configuration, tx })
			})
			if (storage_errors !== null) {
				return err(storage_errors)
			}
			return ok(storage)
		}
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(results)
}

export const storagesListController = async ({
	session,
	ids,
	configuration,
	limit,
	offset
}: {
	session: App.Locals['session']
	configuration: Configuration
	ids?: string[]
	limit: number
	offset: number
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [storage_errors, storage] = await storagesListUseCase({
				ids,
				limit,
				offset,
				storages_repository: getStorageRepositoryModule(),
				...getServerContext({ session, configuration, tx })
			})
			if (storage_errors !== null) {
				return err(storage_errors)
			}
			return ok(storage)
		}
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(results)
}

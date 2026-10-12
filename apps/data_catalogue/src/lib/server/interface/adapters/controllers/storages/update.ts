import { err, ok } from '$lib/server/entities/errors'
import type { Configuration } from '$lib/server/entities/models/configuration'
import { getServerContext } from '$lib/server/application/context'
import { getTransactionModule } from '$lib/server/modules/transaction'
import { getStorageRepositoryModule } from '$lib/server/modules/storage'
import type { StorageInsert } from '$lib/server/entities/models/storage'
import { storageUpdateUseCase } from '$lib/server/application/use_cases/storages/update'

// const presenter = ({ dataset }: { dataset: Dataset }) => dataset

export const storageUpdateController = async ({
	session,
	data,
	configuration,
	id
}: {
	session: App.Locals['session']
	configuration: Configuration
	id: string
	data: Partial<StorageInsert>
}) => {
	if (!session) {
		return err({ reason: 'Unauthenticated' })
	}
	const tx_service = getTransactionModule()
	const [errors, results] = await tx_service.startTransaction({
		clb: async (tx) => {
			const [storage_errors, storage] = await storageUpdateUseCase({
				id,
				data,
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

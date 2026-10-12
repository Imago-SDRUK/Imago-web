import type { AppContext } from '$lib/server/application/context'
import type { IStoragesRepository } from '$lib/server/application/repositories/storages'
import { err, ok } from '$lib/server/entities/errors'
import { log } from '$lib/utils/server/logger'

export const storageDeleteUseCase = async ({
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
	const [errs_storage, result] = await storages_repository.deleteStorage({
		id,
		tx
	})
	if (errs_storage !== null) {
		return err(errs_storage)
	}
	log.trace({ returning: 'storageDeleteUseCase' })
	// TODO: either restrict the crud operations to superusers or create Storage namespace and add permissions, but storages shouldn't be available to non superusers/admins!
	// const [errors_p] = await authorisation_module.createPermission({
	// 	namespace: 'Resource',
	// 	object: result.id,
	// 	relation: 'datasets',
	// 	actor: {
	// 		namespace: 'Dataset',
	// 		object: package_id,
	// 		relation: ''
	// 	}
	// })
	// if (errors_p) {
	// 	return err(errors_p)
	// }
	return ok(result)
}

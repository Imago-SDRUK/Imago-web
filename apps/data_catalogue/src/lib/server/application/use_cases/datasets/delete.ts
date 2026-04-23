import type { AppContext } from '$lib/server/application/context'
import type { DatasetService } from '$lib/server/application/services/dataset'
import { err, ok } from '$lib/server/entities/errors'

export const datasetDeleteUseCase = async ({
	id,
	dataset_service,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	dataset_service: DatasetService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: id,
		permits: 'delete',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [errs] = await dataset_service.deleteDataset({ id })
	if (errs) {
		return err(errs)
	}
	const [d_errs] = await authorisation_module.deletePermission({ namespace: 'Dataset', object: id })
	if (d_errs !== null) {
		return err(d_errs)
	}
	return ok(null)
}

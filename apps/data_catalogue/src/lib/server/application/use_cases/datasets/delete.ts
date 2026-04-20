import type { DatasetService } from '$lib/server/application/services/dataset'
import { err, ok } from '$lib/server/entities/errors'
import type { Session } from '$lib/server/entities/models/identity'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const datasetDeleteUseCase = async ({
	id,
	dataset_service,
	session
}: {
	id: string
	dataset_service: DatasetService
	session: Session
}) => {
	const auth_module = getAuthorisationModule()
	const [errors, permission] = await auth_module.authorise({
		namespace: 'Action',
		object: 'datasets',
		permits: 'delete',
		actor: session.identity.id
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
	const [d_errs] = await auth_module.deletePermission({ namespace: 'Dataset', object: id })
	if (d_errs !== null) {
		return err(d_errs)
	}
	return ok(null)
}

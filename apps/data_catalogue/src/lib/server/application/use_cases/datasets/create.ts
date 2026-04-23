import type { DatasetService } from '$lib/server/application/services/dataset'
import type { GroupsService } from '$lib/server/application/services/groups'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import type { AppContext } from '$lib/server/application/context'
import { type } from 'arktype'
import { generateExtrasFromPayload } from '$lib/globals/datasets'
import { err, ok } from '$lib/server/entities/errors'
import { DatasetSchema } from '$lib/server/entities/models/datasets'
import { getDatasetBasePermissions } from '$lib/utils/auth/permissions/translation'
import slugify from '@sindresorhus/slugify'

export const datasetCreateUseCase = async ({
	data,
	dataset_service,
	group_repository,
	// group_service,
	session,
	configuration,
	authorisation_module
}: {
	data: unknown
	dataset_service: DatasetService
	group_service: GroupsService
	group_repository: GroupsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'datasets',
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
	const dataset = DatasetSchema(data)
	if (dataset instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: dataset.summary, id: 'invalid-dataset' })
	}
	const [g_error, group_r] = await group_repository.getGroup({ id: dataset.groups[0].name })
	if (g_error !== null) {
		return err(g_error)
	}
	if (group_r === null) {
		return err({ reason: 'Not Found' })
	}
	const extras = generateExtrasFromPayload(dataset.extras)
	const [e_dataset, _dataset] = await dataset_service.createDataset({
		data: { ...dataset, extras: extras, name: slugify(dataset.title), owner_org: 'imago' }
	})
	if (e_dataset !== null) {
		return err(e_dataset)
	}
	if (_dataset === null) {
		return err({ reason: 'Not Found' })
	}

	const dataset_permissions = getDatasetBasePermissions({
		object: _dataset,
		owner: session.identity.id,
		group: group_r
	})
	const new_permissions = await Promise.all(
		dataset_permissions.map((permission) => authorisation_module.createPermission(permission))
	)
	const permissions_errors = new_permissions.flatMap(([err]) => {
		if (err !== null) {
			return err
		}
	})
	if (permissions_errors.filter((err) => err !== undefined).length > 0) {
		return err(permissions_errors[0] ?? { reason: 'Unexpected' })
	}
	return ok(_dataset)
}

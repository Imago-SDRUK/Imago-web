import type { DatasetService } from '$lib/server/application/services/dataset'
import type { GroupsService } from '$lib/server/application/services/groups'
import type { AppContext } from '$lib/server/application/context'
import { type } from 'arktype'
import { generateExtrasFromPayload } from '$lib/globals/datasets'
import { err, ok } from '$lib/server/entities/errors'
import { DatasetSchema } from '$lib/server/entities/models/datasets'
import { getDatasetBasePermissions } from '$lib/utils/auth/permissions/translation'
import { log } from '$lib/utils/server/logger'
import slugify from '@sindresorhus/slugify'

export const datasetCreateUseCase = async ({
	data,
	dataset_service,
	group_service,
	session,
	configuration,
	authorisation_module
}: {
	data: unknown
	dataset_service: DatasetService
	group_service: GroupsService
} & AppContext) => {
	log.trace({ message: `Create dataset request` })
	//NOTE: this will only handle the metadata groups, as groups with 'datasets' are linked through permissions
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
	const [g_error, group_r] = await group_service.getGroup({ id: dataset.groups[0].name })
	if (g_error !== null) {
		return err(g_error)
	}
	if (group_r === null) {
		return err({ reason: 'Not Found', message: `Group ${dataset.groups[0].name} doesn't exist` })
	}
	const extras = generateExtrasFromPayload(dataset.extras)
	const [e_dataset, _dataset] = await dataset_service.createDataset({
		data: { ...dataset, extras: extras, name: slugify(dataset.title), owner_org: 'imago' }
	})
	if (e_dataset !== null) {
		return err(e_dataset)
	}
	if (_dataset === null) {
		return err({ reason: 'Not Found', message: `Error creating dataset` })
	}

	const dataset_permissions = getDatasetBasePermissions({
		id: _dataset.id,
		owner: session.identity.id,
		admin_group: configuration.admin_group
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
		log.error({ message: `There's been an error setting the permissions` })
		return err(permissions_errors[0] ?? { reason: 'Unexpected', error: permissions_errors })
	}
	log.trace({ message: `Returning dataset` })
	return ok(_dataset)
}

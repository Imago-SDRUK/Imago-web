import type { Dataset, Resource } from '$lib/server/entities/models/datasets.js'
import type {
	AvailableActor,
	PermissionActor,
	PermissionQuery
} from '$lib/server/entities/models/permissions.js'
import { error, fail } from '@sveltejs/kit'
import { formGetStringOrUndefined, safeJSONParse } from '$lib/utils/forms/index.js'
import {
	datasetGetController,
	datasetGetPermissionsController,
	datasetsGetController
} from '$lib/server/interface/adapters/controllers/datasets/get.js'
import { permissionsGetActorsController } from '$lib/server/interface/adapters/controllers/permissions/get.js'
import { donwloadsGetByDatasetController } from '$lib/server/interface/adapters/controllers/downloads/get.js'
import { permissionCreateController } from '$lib/server/interface/adapters/controllers/permissions/create.js'
import {
	datasetAddGroupController,
	datasetRemoveGroupController
} from '$lib/server/interface/adapters/controllers/datasets/update.js'
import { jstr } from '@arturoguzman/art-ui'
import {
	metadataGroupGetController,
	metadataGroupsGetController
} from '$lib/server/interface/adapters/controllers/metadata_groups/get.js'
import type { GroupService } from '$lib/server/entities/models/groups.js'
import { metadataGroupDeleteController } from '$lib/server/interface/adapters/controllers/metadata_groups/delete.js'
import { permissionUpdateController } from '$lib/server/interface/adapters/controllers/permissions/update.js'
import { permissionDeleteController } from '$lib/server/interface/adapters/controllers/permissions/delete.js'
export const load = async ({ locals, url }) => {
	const datasets = await datasetsGetController({ session: locals.session, url }).then(
		([errors, data]) =>
			errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
	)
	const metadata_groups = await metadataGroupsGetController({ session: locals.session }).then(
		([errors, data]) =>
			errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
	)
	let dataset: Dataset | null = null
	let resources: (Resource & { downloads: number })[] = []
	let relationships: PermissionActor[] = []
	let actors: AvailableActor[] = []
	let metadata_group: GroupService | null = null
	const edit_dataset = url.searchParams.get('edit_dataset')
	const edit_metadata_group = url.searchParams.get('edit_metadata_group')
	if (edit_dataset) {
		;[dataset, resources, relationships, actors] = await Promise.all([
			datasetGetController({ session: locals.session, id: edit_dataset }).then(([errors, data]) =>
				errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
			),
			donwloadsGetByDatasetController({ session: locals.session, id: edit_dataset }).then(
				([errors, data]) =>
					errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
			),
			datasetGetPermissionsController({
				session: locals.session,
				id: edit_dataset
			}).then(([errors, data]) =>
				errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
			),
			permissionsGetActorsController({ session: locals.session }).then(([errors, data]) =>
				errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
			)
		])
	}
	if (edit_metadata_group) {
		metadata_group = await metadataGroupGetController({
			session: locals.session,
			id: edit_metadata_group
		}).then(([errors, data]) =>
			errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
		)
	}
	return {
		datasets,
		metadata_groups,
		resources,
		relationships,
		actors,
		dataset,
		metadata_group
	}
}

export const actions = {
	add_permission: async ({ request, locals }) => {
		const form = await request.formData()
		const relation = formGetStringOrUndefined({ form, field: 'relation' })
		const actor = formGetStringOrUndefined({ form, field: 'actor' })
		const dataset_id = formGetStringOrUndefined({ form, field: 'dataset_id' })
		const [errors] = await permissionCreateController({
			session: locals.session,
			data: {
				actor: safeJSONParse(actor ?? ''),
				namespace: 'Dataset',
				object: String(dataset_id),
				relation: String(relation)
			}
		})
		if (errors !== null) {
			return fail(500, { message: errors.reason })
		}
		return {
			message: `Permission created`
		}
	},
	edit_permission: async ({ request, locals }) => {
		const form = await request.formData()
		const relation = formGetStringOrUndefined({ form, field: 'relation' })
		const actor = formGetStringOrUndefined({ form, field: 'actor' })
		const dataset_id = formGetStringOrUndefined({ form, field: 'dataset_id' })
		const previous = safeJSONParse(formGetStringOrUndefined({ form, field: 'previous' }) ?? '') as {
			actor: string
			relation: string
		}
		const [errors] = await permissionUpdateController({
			session: locals.session,
			data: {
				previous: {
					actor: previous.actor,
					namespace: 'Dataset',
					object: String(dataset_id),
					relation: previous.relation
				},
				new: {
					actor: safeJSONParse(actor ?? ''),
					namespace: 'Dataset',
					object: String(dataset_id),
					relation: String(relation)
				}
			}
		})
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.message ?? errors.reason })
		}
		return {
			message: `Permission updated`
		}
	},
	delete_permission: async ({ request, locals }) => {
		const form = await request.formData()
		const relation = formGetStringOrUndefined({ form, field: 'relation' })
		const actor = formGetStringOrUndefined({ form, field: 'actor' })
		const dataset_id = formGetStringOrUndefined({ form, field: 'dataset_id' })
		const [errors] = await permissionDeleteController({
			session: locals.session,
			data: {
				actor: safeJSONParse(actor ?? ''),
				namespace: 'Dataset',
				object: String(dataset_id),
				relation: String(relation)
			}
		})
		if (errors !== null) {
			return fail(500, { message: errors.reason })
		}
		return {
			message: `Permission deleted`
		}
	},
	add_group: async ({ request, locals }) => {
		const form = await request.formData()
		const group_id = formGetStringOrUndefined({ form, field: 'group_id' })
		const dataset_id = formGetStringOrUndefined({ form, field: 'dataset_id' })
		const [errors] = await datasetAddGroupController({
			session: locals.session,
			dataset_id: dataset_id,
			group_id
		})
		if (errors !== null) {
			console.log(jstr(errors))
			return fail(500, { message: errors.reason, id: errors.reason })
		}
		return {
			message: `Dataset group added`
		}
	},
	remove_group: async ({ request, locals }) => {
		const form = await request.formData()
		const group_id = formGetStringOrUndefined({ form, field: 'group_id' })
		const dataset_id = formGetStringOrUndefined({ form, field: 'dataset_id' })
		const [errors] = await datasetRemoveGroupController({
			session: locals.session,
			dataset_id: dataset_id,
			group_id
		})
		if (errors !== null) {
			console.log(jstr(errors))
			return fail(500, { message: errors.reason, id: errors.reason })
		}
		return {
			message: `Dataset group removed`
		}
	},
	delete_group: async ({ request, locals }) => {
		const form = await request.formData()
		const group_id = formGetStringOrUndefined({ form, field: 'group_id' })
		const [errors] = await metadataGroupDeleteController({ session: locals.session, id: group_id })

		if (errors !== null) {
			console.log(jstr(errors))
			return fail(500, { message: errors.reason, id: errors.reason })
		}
		return {
			message: `Metadata group deleted`
		}
	}
	// 	add_permission: async ({ request, locals }) => {
	// 		const form = await request.formData()
	// 		const actor = safeJSONParse(formGetStringOrUndefined({ form, field: 'actor' }) ?? '')
	// const [errors, permission] = await permissionCreateController({session: locals.session, data: actor})
	//     if(errors !== null){
	//       return fail(500, {message: errors.reason})
	//     }
	// 		return {
	// 			message: `Metadata group deleted`
	// 		}
	// 	}
}

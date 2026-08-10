import type { Dataset, Resource, Tag, Vocabulary } from '$lib/server/entities/models/datasets.js'
import type { AvailableActor, PermissionActor } from '$lib/server/entities/models/permissions.js'
import { error, fail } from '@sveltejs/kit'
import { formGetStringOrUndefined, safeJSONParse } from '$lib/utils/forms/index.js'
import {
	datasetGetController,
	datasetGetPermissionsController
} from '$lib/server/interface/adapters/controllers/datasets/get.js'
import {
	permissionsCheckController,
	permissionsGetActorsController
} from '$lib/server/interface/adapters/controllers/permissions/get.js'
import { donwloadsGetByDatasetController } from '$lib/server/interface/adapters/controllers/downloads/get.js'
import {
	permissionCreateController,
	permissionsCreateController
} from '$lib/server/interface/adapters/controllers/permissions/create.js'
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
import { metadataGroupCreateController } from '$lib/server/interface/adapters/controllers/metadata_groups/create.js'
import { resourcesGetController } from '$lib/server/interface/adapters/controllers/resources/get.js'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors.js'
import type {
	ResourceVersion,
	Resource as ResourceRepo
} from '$lib/server/entities/models/resources.js'
import type { CSVW } from '$lib/server/entities/models/datastore.js'
import { tagsMigrateController } from '$lib/server/interface/adapters/controllers/tags/update.js'
import {
	tagsGetController,
	tagsGetVocabulariesController
} from '$lib/server/interface/adapters/controllers/tags/get.js'
import { tagDeleteController } from '$lib/server/interface/adapters/controllers/tags/delete.js'
import { applicationGetDatasetsController } from '$lib/server/interface/adapters/controllers/application/get.js'
export const load = async ({ locals, url }) => {
	let allow_manage = false
	const [check_errs, check] = await permissionsCheckController({
		permissions: [{ namespace: 'Application', object: 'datasets', permits: 'manage' }],
		configuration: locals.configuration,
		session: locals.session
	})
	if (check_errs === null) {
		if (check.results.every((check) => check.allowed)) {
			allow_manage = true
		}
	}
	const offset = url.searchParams.get('offset') ? Number(url.searchParams.get('offset')) : 0
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 10
	if (offset === 0) {
		url.searchParams.delete('offset')
	}
	const datasets = await applicationGetDatasetsController({
		offset,
		page_size: limit,
		session: locals.session,
		url,
		configuration: locals.configuration
	}).then(([errors, data]) =>
		errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
	)
	const metadata_groups = await metadataGroupsGetController({
		session: locals.session,
		configuration: locals.configuration
	}).then(([errors, data]) =>
		errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
	)

	const [vocabularies_err, vocabularies] = await tagsGetVocabulariesController()
	if (vocabularies_err !== null) {
		return error(500, { message: vocabularies_err.reason, id: 'voc-err' })
	}
	const tags = await Promise.all(
		vocabularies.map((vocabulary) =>
			tagsGetController({
				configuration: locals.configuration,
				session: locals.session,
				vocabulary_id: vocabulary.id
			}).then(([errors, data]) => {
				if (errors !== null) {
					return err(errors)
				}
				return ok({ ...data, vocabulary })
			})
		)
	).then((res) =>
		res.reduce(
			(acc, [errors, data]) => {
				if (errors !== null) {
					acc.errors.push(errors)
					return acc
				}
				acc.data.push(data)
				return acc
			},
			{ data: [], errors: [] } as {
				data: {
					items: Tag[] | string[]
					limit: number
					next: number
					total: number
					vocabulary: Vocabulary
				}[]
				errors: ErrTypes[]
			}
		)
	)
	if (tags.errors.length > 0) {
		if (tags.errors[0].reason !== 'Not Found') {
			error(400, { message: tags.errors[0].reason, id: tags.errors[0].reason })
		}
	}
	let dataset: Dataset | null = null
	let resources: (Resource & { downloads: number })[] = []
	let relationships: PermissionActor[] = []
	let actors: AvailableActor[] = []
	let metadata_group: GroupService | null = null

	const edit_dataset = url.searchParams.get('edit_dataset')
	const edit_metadata_group = url.searchParams.get('edit_metadata_group')
	if (edit_dataset) {
		;[dataset, resources, relationships, actors] = await Promise.all([
			datasetGetController({
				configuration: locals.configuration,
				session: locals.session,
				id: edit_dataset
			}).then(([errors, data]) => {
				if (errors !== null) {
					console.log(errors)
					error(500, { message: errors.reason, id: errors.reason })
				}
				return data
			}),
			donwloadsGetByDatasetController({
				configuration: locals.configuration,
				session: locals.session,
				id: edit_dataset
			}).then(([errors, data]) => {
				if (errors !== null) {
					console.log(errors)
					error(500, { message: errors.reason, id: errors.reason })
				}
				return data
			}),
			datasetGetPermissionsController({
				configuration: locals.configuration,
				session: locals.session,
				id: edit_dataset
			}).then(([errors, data]) => {
				if (errors !== null) {
					console.log(errors)
					error(500, { message: errors.reason, id: errors.reason })
				}
				return data
			}),
			permissionsGetActorsController({
				configuration: locals.configuration,
				session: locals.session
			}).then(([errors, data]) => {
				if (errors !== null) {
					console.log(errors)
					error(500, { message: errors.reason, id: errors.reason })
				}
				return data
			})
		])
	}
	if (edit_metadata_group) {
		metadata_group = await metadataGroupGetController({
			configuration: locals.configuration,
			session: locals.session,
			id: edit_metadata_group
		}).then(([errors, data]) =>
			errors !== null ? error(500, { message: errors.reason, id: errors.reason }) : data
		)
	}
	return {
		allow_manage,
		datasets,
		metadata_groups,
		resources,
		relationships,
		actors,
		dataset,
		metadata_group,
		tags: tags.data
	}
}

export const actions = {
	add_permission: async ({ request, locals }) => {
		const form = await request.formData()
		const relation = formGetStringOrUndefined({ form, field: 'relation' })
		const actor = formGetStringOrUndefined({ form, field: 'actor' })
		const dataset_id = formGetStringOrUndefined({ form, field: 'dataset_id' })
		const [errors] = await permissionCreateController({
			configuration: locals.configuration,
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
	sync_resources_permissions: async ({ request, locals }) => {
		const form = await request.formData()
		const dataset_id = formGetStringOrUndefined({ form, field: 'dataset_id' })
		const resources = safeJSONParse(formGetStringOrUndefined({ form, field: 'resources' })) as {
			resource_id: string
		}[]
		const res = await Promise.all(
			resources.map((resource) =>
				resourcesGetController({
					configuration: locals.configuration,
					session: locals.session,
					id: resource.resource_id
				})
			)
		)
		const { resources_errors, resources_results } = res.reduce(
			(acc, [errors, data]) => {
				if (errors !== null) {
					acc.resources_errors.push(errors)
					return acc
				}

				acc.resources_results.push(data)
				return acc
			},
			{ resources_errors: [], resources_results: [] } as {
				resources_errors: ErrTypes[]
				resources_results: {
					resource: ResourceRepo
					versions: ResourceVersion[]
					metadata: CSVW | null
				}[]
			}
		)
		if (resources_errors.length > 0) {
			return fail(400, { message: resources_errors[0].message ?? resources_errors[0].reason })
		}
		const [permissions_errors] = await permissionsCreateController({
			configuration: locals.configuration,
			session: locals.session,
			data: [
				...resources_results.flatMap((resource) => [
					{
						namespace: 'Resource' as const,
						object: resource.resource.id,
						relation: 'datasets',
						actor: {
							namespace: 'Dataset' as const,
							object: dataset_id ?? '',
							relation: ''
						}
					},
					...resource.versions.map((version) => ({
						namespace: 'ResourceVersion' as const,
						object: version.id,
						relation: 'resources',
						actor: {
							namespace: 'Resource' as const,
							object: resource.resource.id,
							relation: ''
						}
					}))
				])
			]
		})
		if (permissions_errors !== null) {
			return fail(400, { message: permissions_errors?.message ?? permissions_errors.reason })
		}
		return {
			message: 'Permissions synced'
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
			configuration: locals.configuration,
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
			configuration: locals.configuration,
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
			configuration: locals.configuration,
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
			configuration: locals.configuration,
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
		const [errors] = await metadataGroupDeleteController({
			configuration: locals.configuration,
			session: locals.session,
			id: group_id
		})

		if (errors !== null) {
			console.log(jstr(errors))
			return fail(500, { message: errors.reason, id: errors.reason })
		}
		return {
			message: `Metadata group deleted`
		}
	},
	create_metadata_group: async ({ request, locals }) => {
		const form = await request.formData()
		const title = formGetStringOrUndefined({ form, field: 'title' })
		const description = formGetStringOrUndefined({ form, field: 'description' })
		const [errors] = await metadataGroupCreateController({
			configuration: locals.configuration,
			session: locals.session,
			data: {
				title,
				description
			}
		})

		if (errors !== null) {
			console.log(jstr(errors))
			return fail(500, { message: errors.reason, id: errors.reason })
		}
		return {
			message: `Metadata group created`
		}
	},
	migrate_tags: async ({ request, locals }) => {
		const form = await request.formData()
		const dataset_id = formGetStringOrUndefined({ form, field: 'dataset_id' })
		const [errors] = await tagsMigrateController({
			configuration: locals.configuration,
			session: locals.session,
			dataset_id
		})
		if (errors !== null) {
			return fail(500, { message: errors.message ?? errors.type })
		}
		return {
			message: 'ok'
		}
	},
	delete_tag: async ({ locals, request }) => {
		const form = await request.formData()
		const tag_id = formGetStringOrUndefined({ form, field: 'tag_id' })
		const vocabulary_id = formGetStringOrUndefined({ form, field: 'vocabulary_id' })
		const [errors] = await tagDeleteController({
			configuration: locals.configuration,
			session: locals.session,
			tag_id,
			vocabulary_id
		})
		if (errors !== null) {
			console.log(errors)
			return fail(400, { message: `Error deleting the tag` })
		}
		return { message: `Tag deleted` }
	}
}

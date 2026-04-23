import type { DatasetService } from '$lib/server/application/services/dataset'
import type { GroupsService } from '$lib/server/application/services/groups'
import type { TagsService } from '$lib/server/application/services/tags'
import type { DatasetRequest } from '$lib/server/entities/models/datasets'
import { err, ok } from '$lib/server/entities/errors'
import { generateExtrasFromPayload } from '$lib/globals/datasets'
import type { AppContext } from '$lib/server/application/context'

export const datasetUpdateUseCase = async ({
	id,
	data,
	dataset_service,
	session,
	authorisation_module,
	configuration
}: {
	id: string
	data?: DatasetRequest
	dataset_service: DatasetService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: id,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})

	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	if (!data) {
		return err({ reason: 'Invalid Data' })
	}
	const extras = generateExtrasFromPayload(data.extras)
	const [errs, dataset] = await dataset_service.updateDataset({ id, data: { ...data, extras } })
	if (errs !== null) {
		return err(errs)
	}
	return ok(dataset)
}

export const datasetAddTagUseCase = async ({
	id,
	tag,
	vocabulary_id,
	tags_service,
	dataset_service,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	tag: string
	vocabulary_id: string
	dataset_service: DatasetService
	tags_service: TagsService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: id,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})

	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs_dataset, dataset] = await dataset_service.getDataset({ id })
	if (errs_dataset !== null) {
		return err(errs_dataset)
	}
	if (!dataset) {
		return err({ reason: 'Not Found' })
	}
	const [tag_errs, tag_record] = await tags_service.getTag({ id: tag, vocabulary_id })

	if (tag_errs !== null) {
		if (tag_errs.reason !== 'Not Found') {
			return err(tag_errs)
		}
	}
	let t_record = tag_record
	if (!t_record) {
		t_record = await tags_service.createTag({ tag: { name: tag, vocabulary_id } })
	}
	if (dataset.tags.find((_tag) => _tag.id === t_record.id)) return ok(dataset)
	const new_tags = [...dataset.tags, t_record]
	const updated_dataset = await dataset_service.updateDataset({
		id,
		data: { ...dataset, tags: new_tags }
	})
	return updated_dataset
}

export const datasetRemoveTagUseCase = async ({
	id,
	tag_id,
	vocabulary_id,
	tags_service,
	dataset_service,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	tag_id: string
	vocabulary_id: string
	dataset_service: DatasetService
	tags_service: TagsService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: id,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs_dataset, dataset] = await dataset_service.getDataset({ id })
	if (errs_dataset !== null) {
		return err(errs_dataset)
	}
	if (!dataset) {
		return err({ reason: 'Not Found' })
	}
	const [tag_errs, tag] = await tags_service.getTag({ id: tag_id, vocabulary_id })
	if (tag_errs !== null) {
		return err(tag_errs)
	}
	if (!tag) {
		return ok(dataset)
	}
	const index = dataset.tags.findIndex((_tag) => _tag.id === tag.id)
	if (index === -1) return ok(dataset)
	const new_tags = [...dataset.tags.slice(0, index), ...dataset.tags.slice(index + 1)]
	const updated_dataset = await dataset_service.updateDataset({
		id,
		data: { ...dataset, tags: new_tags }
	})
	return updated_dataset
}

export const datasetAddGroupUseCase = async ({
	group_id,
	dataset_id,
	groups_service,
	dataset_service,
	session,
	configuration,
	authorisation_module
}: {
	group_id: string
	dataset_id: string
	groups_service: GroupsService
	dataset_service: DatasetService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: dataset_id,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})

	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [group_err, group] = await groups_service.getGroup({ id: group_id })
	if (group_err !== null) {
		return err(group_err)
	}

	if (group === null) {
		return err({ reason: 'Not Found' })
	}
	const [dataset_err, dataset] = await dataset_service.getDataset({
		id: dataset_id
	})
	if (dataset_err !== null) {
		return err(dataset_err)
	}
	const updated_groups = [
		...(dataset?.groups ?? []),
		{ id: group.id, name: group.name, title: group.title }
	]
	const [udataset_err, udataset] = await dataset_service.updateDataset({
		id: dataset_id,
		data: {
			id: dataset_id,
			groups: updated_groups
		}
	})
	if (udataset_err !== null) {
		return err(udataset_err)
	}
	return ok(udataset)
}

export const datasetRemoveGroupUseCase = async ({
	group_id,
	dataset_id,
	dataset_service,
	session,
	configuration,
	authorisation_module
}: {
	group_id: string
	dataset_id: string
	dataset_service: DatasetService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: dataset_id,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs_dataset, dataset] = await dataset_service.getDataset({ id: dataset_id })
	if (errs_dataset !== null) {
		return err(errs_dataset)
	}
	if (!dataset) {
		return err({ reason: 'Not Found' })
	}
	const remove_index = dataset.groups.findIndex((group) => group.id === group_id)
	if (remove_index === -1) {
		return ok(dataset)
	}
	const groups = [
		...dataset.groups.slice(0, remove_index),
		...dataset.groups.slice(remove_index + 1)
	]

	const [ud_errors, updated_dataset] = await dataset_service.updateDataset({
		id: dataset_id,
		data: {
			id: dataset.id,
			groups: groups
		}
	})
	if (ud_errors !== null) {
		return err(ud_errors)
	}

	return ok(updated_dataset)
}

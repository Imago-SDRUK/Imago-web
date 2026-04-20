import {
	datasetAddTagController,
	datasetGetController,
	datasetRemoveTagController
} from '$lib/server/interface/adapters/controllers/datasets/get.js'
import {
	tagsGetController,
	tagsGetVocabulariesController
} from '$lib/server/interface/adapters/controllers/tags/get.js'
import { formGetStringOrUndefined } from '$lib/utils/forms/index.js'
import { datasetUpdateController } from '$lib/server/interface/adapters/controllers/datasets/update.js'
import { datastoreUpdateController } from '$lib/server/interface/adapters/controllers/datastore/update.js'
import { resourceUpdateController } from '$lib/server/interface/adapters/controllers/resources/update.js'
import { error, fail } from '@sveltejs/kit'

export const load = async ({ params, locals }) => {
	const [dataset_err, dataset] = await datasetGetController({
		session: locals.session,
		id: params.id
	})
	if (dataset_err !== null) {
		error(400, { message: dataset_err.reason, id: dataset_err.reason })
	}
	if (dataset === null) {
		error(404, { message: 'Not found', id: 'not-found' })
	}
	const [tags_err, tags] = await tagsGetController({
		session: locals.session,
		vocabulary_id: 'general'
	})

	if (tags_err !== null) {
		error(400, { message: tags_err.reason, id: tags_err.reason })
	}
	return {
		dataset,
		tags: tags.items
	}
}

// type FormField = { name: string; type: 'string' | 'file' | 'boolean' | 'array'; required: boolean }

const parseForm = (form: FormData) => {
	const object: Record<PropertyKey, unknown> = {}
	form.forEach((value, key) => {
		// Reflect.has in favor of: object.hasOwnProperty(key)
		if (key in object === false) {
			object[key] = value
			return
		}
		if (!Array.isArray(object[key])) {
			object[key] = [object[key]]
		}
		if (Array.isArray(object[key])) {
			object[key].push(value)
		}
	})
	return object
}

export const actions = {
	add_tag: async ({ locals, params, request }) => {
		const form = await request.formData()
		const tag = formGetStringOrUndefined({ form, field: 'tag' })
		const [errs, vocabularies] = await tagsGetVocabulariesController()
		if (errs !== null) {
			return fail(400, { message: `Error finding the vocabulary general` })
		}
		const vocabulary_id = vocabularies.find((v) => v.name === 'general')
		if (!vocabulary_id) {
			return fail(400, { message: `Error finding the vocabulary general` })
		}
		const [errors] = await datasetAddTagController({
			session: locals.session,
			id: params.id,
			vocabulary_id: vocabulary_id.id,
			tag: String(tag)
		})
		if (errors !== null) {
			return fail(400, { message: `Error adding the tag ${tag}` })
		}
		return { message: `Tag ${tag} added` }
	},
	remove_tag: async ({ locals, params, request }) => {
		const form = await request.formData()
		const tag = formGetStringOrUndefined({ form, field: 'tag' })
		const vocabulary_id = 'general'
		const [errors] = await datasetRemoveTagController({
			session: locals.session,
			id: params.id,
			tag_id: tag,
			vocabulary_id
		})
		if (errors !== null) {
			return fail(400, { message: errors.reason })
		}
		return { message: `Tag ${tag} removed` }
	},

	update: async ({ request, locals, params }) => {
		const form = await request.formData()
		const data = parseForm(form)
		await datasetUpdateController({ data, id: params.id, session: locals.session })
		return {
			message: `Dataset successfully updated`
		}
	},

	update_resource: async ({ request, params, locals }) => {
		const form = await request.formData()
		const parsed = parseForm(form)
		await resourceUpdateController({
			id: params.id,
			session: locals.session,
			data: parsed
		})
		return {
			message: `Resource successfully updated`
		}
	},

	update_datastore: async ({ request, locals }) => {
		const form = await request.formData()
		const id = formGetStringOrUndefined({ form, field: 'id' })
		const metadata = parseForm(form)
		await datastoreUpdateController({
			session: locals.session,
			metadata,
			resource_id: id
		})
		return {
			message: `Datastore updated`
		}
		// if (res.ok) {
		// 	log.debug(jstr(data))
		// 	return {
		// 		message: data.message
		// 	}
		// }
		// return fail(res.status, {
		// 	message: data.message
		// })
	}
}

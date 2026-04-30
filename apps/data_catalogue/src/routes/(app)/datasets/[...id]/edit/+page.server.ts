import {
	tagsGetController,
	tagsGetVocabulariesController
} from '$lib/server/interface/adapters/controllers/tags/get.js'
import { formGetStringOrUndefined, safeJSONParse } from '$lib/utils/forms/index.js'
import {
	datasetAddTagController,
	datasetRemoveTagController,
	datasetUpdateController
} from '$lib/server/interface/adapters/controllers/datasets/update.js'
import { datastoreUpdateController } from '$lib/server/interface/adapters/controllers/datastore/update.js'
import {
	resourceAddVersionController,
	resourceUpdateController
} from '$lib/server/interface/adapters/controllers/resources/update.js'
import { error, fail } from '@sveltejs/kit'
import { resourceCreateController } from '$lib/server/interface/adapters/controllers/resources/create.js'
import { resourceDeleteController } from '$lib/server/interface/adapters/controllers/resources/delete.js'

export const load = async ({ locals, parent }) => {
	const { dataset, permits } = await parent()
	if (!permits.includes('edit')) {
		error(401, { message: 'Unauthorised', id: 'Unauthorised' })
	}
	const [tags_err, tags] = await tagsGetController({
		configuration: locals.configuration,
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
			configuration: locals.configuration,
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
			configuration: locals.configuration,
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
		const data = safeJSONParse(formGetStringOrUndefined({ form, field: 'dataset' }))
		const [errors, result] = await datasetUpdateController({
			configuration: locals.configuration,
			data,
			id: params.id,
			session: locals.session
		})
		if (errors !== null) {
			return fail(400, { message: errors.message, id: errors.reason })
		}
		return {
			message: `Dataset successfully updated`
		}
	},

	update_resource: async ({ request, params, locals }) => {
		const form = await request.formData()
		const parsed = parseForm(form)
		await resourceUpdateController({
			configuration: locals.configuration,
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
			configuration: locals.configuration,
			session: locals.session,
			metadata,
			resource_id: id
		})
		return {
			message: `Datastore updated`
		}
	},
	upload_file: async ({ request, locals }) => {
		const form = await request.formData()
		const parsed = parseForm(form) as {
			name: string
			description: string
			type: string
			package_id: string
		}
		console.log(form)
		const [errors, resource] = await resourceCreateController({
			session: locals.session,
			configuration: locals.configuration,
			data: parsed
		})
		if (errors !== null) {
			// return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(resource)
		return {
			message: 'ok'
		}
	},

	delete_resource: async ({ request, locals }) => {
		const form = await request.formData()
		const resource_id = formGetStringOrUndefined({ form, field: 'resource_id' })
		const [errors, resource] = await resourceDeleteController({
			session: locals.session,
			configuration: locals.configuration,
			data: { resource_id: resource_id }
		})
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(resource)
		return {
			message: 'ok'
		}
	},
	add_version: async ({ request, locals }) => {
		const form = await request.formData()
		const resource_id = formGetStringOrUndefined({ form, field: 'resource_id' })
		const version = formGetStringOrUndefined({ form, field: 'version' })
		const changelog = formGetStringOrUndefined({ form, field: 'changelog' })
		const [errors, url] = await resourceAddVersionController({
			session: locals.session,
			configuration: locals.configuration,
			data: {
				resource: resource_id,
				version: version,
				changelog: changelog
			}
		})
		if (errors !== null) {
			console.log(errors)
			return fail(500, { message: errors.message ?? errors.reason })
		}
		console.log(url)
		return {
			message: 'ok',
			url
		}
	}
}

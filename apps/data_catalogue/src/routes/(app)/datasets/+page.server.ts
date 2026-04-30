import type { PageServerLoadEvent } from './$types.js'
import { error, fail, redirect } from '@sveltejs/kit'
import licenses from '$lib/utils/ckan/licenses.json'
import { formGetStringOrUndefined, safeJSONParse } from '$lib/utils/forms/index.js'
import { datasetsGetController } from '$lib/server/interface/adapters/controllers/datasets/get.js'
import {
	tagsGetController,
	tagsGetVocabulariesController
} from '$lib/server/interface/adapters/controllers/tags/get.js'
import { datasetDeleteController } from '$lib/server/interface/adapters/controllers/datasets/delete.js'
import { datasetCreateController } from '$lib/server/interface/adapters/controllers/datasets/create.js'

export const load = async ({ locals, url }: PageServerLoadEvent) => {
	// get query parameters
	const search = url.searchParams.get('search') ?? undefined
	const offset = url.searchParams.get('offset') ? Number(url.searchParams.get('offset')) : 0
	const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : 10
	if (offset === 0) {
		url.searchParams.delete('offset')
	}

	const [errs, datasets] = await datasetsGetController({
		configuration: locals.configuration,
		url,
		offset,
		page_size: limit,
		search,
		session: locals.session
	})
	if (errs !== null) {
		error(400, { message: 'Error getting the dataset', id: errs.reason })
	}
	const [voc_errors, vocabularies] = await tagsGetVocabulariesController()
	if (voc_errors !== null) {
		error(400, { message: voc_errors.reason, id: voc_errors.reason })
	}
	const voc_id = vocabularies.find((voc) => voc.name === 'general')
	const [errors, tags] = await tagsGetController({
		configuration: locals.configuration,
		vocabulary_id: voc_id?.id,
		session: locals.session
	})
	if (errors !== null) {
		error(400, { message: 'error getting tags', id: '' })
	}

	return {
		datasets: datasets.items,
		datasets_count: datasets.total,
		package_count: 0,
		tags: tags.items,
		resources: {
			result: [
				...new Set(datasets.items.flatMap(({ resources }) => resources).map((r) => r.format))
			].filter((format) => format !== '')
		},
		licenses: { result: licenses }
	}
}

export const actions = {
	create: async ({ request, locals }) => {
		const form = await request.formData()
		const group_name = formGetStringOrUndefined({ form, field: 'group' })
		const title = formGetStringOrUndefined({ form, field: 'title' })
		const file = form.get('file')
		let payload: Record<PropertyKey, unknown> = {}
		if (file && file instanceof File && file.size > 0) {
			if (file.type !== 'application/json') {
				return fail(400, { message: 'File must be a json file' })
			}
			if (file.size > 2000000) {
				return fail(400, { message: 'File must be less than 2MB' })
			}
			const file_text = await file.text()
			const text_parse = await safeJSONParse(file_text)
			if (!text_parse) {
				return fail(400, { message: 'File must be a valid json file' })
			}
			if (typeof text_parse !== 'object' && text_parse !== null) {
				return fail(400, { message: 'File must be a valid json file' })
			}
			if (Object.keys(text_parse).length === 0) {
				return fail(400, { message: 'File must contain data' })
			}

			const [voc_errors, vocabularies] = await tagsGetVocabulariesController()
			if (voc_errors !== null) {
				return fail(400, { message: voc_errors.message })
			}
			const voc_id = vocabularies.find((voc) => voc.name === 'general')
			const tags = text_parse?.['tags']
				?.split(`,`)
				?.map((str) => ({ name: str, vocabulary_id: voc_id?.id }))
			payload = { ...text_parse, tags }
		} else {
			// const [group_err, group] = await groupGetController({
			// 	configuration: locals.configuration,
			// 	session: locals.session,
			// 	id: group_id
			// })
			// if (group_err !== null) {
			// 	return fail(404, { message: group_err.reason })
			// }
			//
			// if (group === null) {
			// 	return fail(404, { message: 'Group not found' })
			// }
			payload = {
				title: title,
				groups: [{ name: group_name }],
				owner_org: 'imago'
			}
		}
		const [dataset_err, dataset] = await datasetCreateController({
			configuration: locals.configuration,
			session: locals.session,
			data: payload
		})
		if (dataset_err !== null) {
			if (dataset_err.reason === 'Invalid Data') {
				return fail(400, { message: dataset_err.message })
			}
			if (dataset_err.reason === 'Not Found') {
				return fail(400, { message: dataset_err.message })
			}
			return fail(500, { message: dataset_err.reason })
		}
		redirect(307, `/datasets/${dataset.name}`)
	},

	delete: async ({ locals, request }) => {
		const form = await request.formData()
		const id = formGetStringOrUndefined({ form, field: 'id' })
		const [errors] = await datasetDeleteController({
			configuration: locals.configuration,
			id,
			session: locals.session
		})
		if (errors !== null) {
			if (errors.reason === 'Invalid Data') {
				return fail(500, { message: errors.message })
			}
			return fail(500, { message: errors.reason })
		}
		return redirect(307, `/datasets`)
	}
}

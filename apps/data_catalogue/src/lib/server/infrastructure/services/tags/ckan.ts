import type { TagsService } from '$lib/server/application/services/tags'
import { env } from '$env/dynamic/private'
import { create, createCkanClient, get } from '$lib/utils/ckan/ckan'
import { error } from '@sveltejs/kit'
import { log } from '$lib/utils/server/logger'
import { err, ok } from '$lib/server/entities/errors'
import { handleCkanError } from '$lib/server/infrastructure/utils/services/ckan'

const getTag: TagsService['getTag'] = async ({ id, vocabulary_id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(
			get('tag_show', {
				id,
				vocabulary_id
			})
		)
		if (!res.success) {
			return err(handleCkanError(res, 'getTag'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getTags: TagsService['getTags'] = async ({ vocabulary_id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(
			get('tag_list', {
				vocabulary_id,
				all_fields: true
			})
		)
		if (!res.success) {
			return err(handleCkanError(res, 'getTags'))
		}
		return ok({
			items: res.result,
			limit: 0,
			next: 0,
			total: 0
		})
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const searchTags: TagsService['getTags'] = async ({ offset, limit, vocabulary_id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const data = await ckan.request(
		get('tag_search', {
			query: 'test',
			limit,
			offset,
			vocabulary_id
		})
	)
	if (data.success === false) {
		error(400, { message: `There's been an issue processing this request`, id: 'search-error' })
	}
	const max_pages = Math.floor(data.result.count / limit)
	const next = offset + 1 > max_pages ? max_pages : offset + 1

	return {
		items: data.result.results,
		limit,
		next: next,
		total: data.result.count
	}
}

const createTag: TagsService['createTag'] = async ({ tag }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})

		const res = await ckan.request(create('tag_create', tag))
		if (!res.success) {
			return err(handleCkanError(res, 'createTag'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const createVocabulary: TagsService['createVocabulary'] = async ({ vocabulary }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})

		const res = await ckan.request(create('vocabulary_create', vocabulary))
		if (!res.success) {
			return err(handleCkanError(res, 'createVocabulary'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getVocabulary: TagsService['getVocabulary'] = async ({ vocabulary_id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(get('vocabulary_show', { id: vocabulary_id }))
		if (!res.success) {
			return err(handleCkanError(res, 'getVocabulary'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getVocabularies: TagsService['getVocabularies'] = async () => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})

		const res = await ckan.request(get('vocabulary_list'))
		if (!res.success) {
			return err(handleCkanError(res, 'getVocabularies'))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const infrastructureServiceTagsCkan: TagsService = {
	getTags,
	createTag,
	createVocabulary,
	getVocabulary,
	getTag,
	getVocabularies
}

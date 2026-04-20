import type { TagsService } from '$lib/server/application/services/tags'
import { env } from '$env/dynamic/private'
import { create, createCkanClient, get } from '$lib/utils/ckan/ckan'
import { error } from '@sveltejs/kit'
import { log } from '$lib/utils/server/logger'
import { err, ok } from '$lib/server/entities/errors'

const getTag: TagsService['getTag'] = async ({ id, vocabulary_id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const data = await ckan.request(
		get('tag_show', {
			id,
			vocabulary_id
		})
	)
	if (data.success === false) {
		if ('error' in data && data.error?.__type === 'Not Found Error') {
			return err({ reason: 'Not Found' })
		}
		return err({ reason: 'Unexpected' })
	}
	return ok(data.result)
}

const getTags: TagsService['getTags'] = async ({ vocabulary_id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const data = await ckan.request(
		get('tag_list', {
			vocabulary_id,
			all_fields: true
		})
	)
	if (data.success === false) {
		if ('error' in data && data.error?.__type === 'Not Found Error') {
			return err({ reason: 'Not Found' })
		}
		return err({ reason: 'Unexpected' })
	}

	return ok({
		items: data.result,
		limit: 0,
		next: 0,
		total: 0
	})
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
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})

	const data = await ckan.request(create('tag_create', tag))
	if (data.success === false) {
		log.error(data)
		error(400, { message: `There's been an issue creating this tag ${tag.name}`, id: 'tag-error' })
	}
	return data.result
}

const createVocabulary: TagsService['createVocabulary'] = async ({ vocabulary }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})

	const data = await ckan.request(create('vocabulary_create', vocabulary))
	if (data.success === false) {
		log.error(data)
		error(400, {
			message: `There's been an issue creating this vocabulary`,
			id: 'vocabulary-error'
		})
	}
	return data.result
}

const getVocabulary: TagsService['getVocabulary'] = async ({ vocabulary_id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const data = await ckan.request(get('vocabulary_show', { id: vocabulary_id }))
	if (data.success === false) {
		log.error(data)
		if ('error' in data && data.error?.__type === 'Not Found Error') {
			return null
		}
		error(400, {
			message: `There's been an issue retreiving this vocabulary`,
			id: 'vocabulary-error'
		})
	}
	return data.result
}

const getVocabularies: TagsService['getVocabularies'] = async () => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})

	const data = await ckan.request(get('vocabulary_list'))
	if (!data.success) {
		return err({ reason: 'Unexpected', error: data })
	}
	return ok(data.result)
}

export const infrastructureServiceTagsCkan: TagsService = {
	getTags,
	createTag,
	createVocabulary,
	getVocabulary,
	getTag,
	getVocabularies
}

import { env } from '$env/dynamic/private'
import type { DatasetService } from '$lib/server/application/services/dataset'
import { err, ok } from '$lib/server/entities/errors'
import { create, createCkanClient, get, patch, remove } from '$lib/utils/ckan/ckan'
import { getSolrSearchParams } from '$lib/utils/ckan/datasets'
import { jstr } from '@arturoguzman/art-ui'

const createDataset: DatasetService['createDataset'] = async ({ data }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const [errors, dataset] = await ckan
		.request(create('package_create', data))
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errors !== null) {
		return err(errors)
	}
	if (!dataset.success) {
		return err({ reason: 'Unexpected' })
	}
	return ok(dataset.result)
}

const getDataset: DatasetService['getDataset'] = async ({ id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const [errors, data] = await ckan
		.request(
			get('package_show', {
				id,
				include_plugin_data: true,
				use_default_schema: true
			})
		)
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errors !== null) {
		return err(errors)
	}
	if (!data.success) {
		return err({ reason: 'Unexpected' })
	}
	return ok(data.result)
}

const getDatasetsCount: DatasetService['getDatasetsCount'] = async () => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const [errors, data] = await ckan
		.request(
			get('package_list', {
				limit: 9999
			})
		)
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errors !== null) {
		return err(errors)
	}
	if (!data.success) {
		return err({ reason: 'Unexpected' })
	}
	return ok(data.result.length)
}

const getDatasets: DatasetService['getDatasets'] = async ({ page_size, offset, search, url }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const limit = page_size
	const fq = getSolrSearchParams(url)
	/**
	 * NOTE: solr endpoint as private and drafts are not available through ckan endpoints
	 **/
	const [errors, data] = await ckan
		.request(
			get('package_search', {
				q: search,
				start: offset <= 0 ? 0 : offset,
				rows: limit,
				fq,
				include_private: true,
				include_drafts: true
			})
		)
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errors !== null) {
		return err(errors)
	}
	if (!data.success) {
		return err({ reason: 'Unexpected' })
	}
	const max_pages = Math.floor(data.result.count / page_size)
	const next = offset + 1 > max_pages ? max_pages : offset + 1

	return ok({
		items: data.result.results,
		page_size,
		next: next,
		total: data.result.count
	})
}

const getDatasetActivity: DatasetService['getDatasetActivity'] = async ({
	id,
	page_size,
	offset
}) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const [errors, data] = await ckan
		.request(get('package_activity_list', { id, offset, limit: page_size }))
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))

	if (errors !== null) {
		return err(errors)
	}
	if (!data.success) {
		return err({ reason: 'Unexpected', error: data })
	}
	return ok(data.result)
}

const updateDataset: DatasetService['updateDataset'] = async ({ id, data }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const [errors, res] = await ckan
		.request(patch('package_patch', { id }, data))
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errors !== null) {
		return err(errors)
	}

	if (!res.success) {
		return err({ reason: 'Unexpected', error: data })
	}

	return ok(res.result)
}

const deleteDataset: DatasetService['deleteDataset'] = async ({ id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const [errors, data] = await ckan
		.request(remove('package_delete', { id }))
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errors !== null) {
		return err(errors)
	}

	if (!data.success) {
		return err({ reason: 'Unexpected', error: data })
	}
	return ok(null)
}

export const infrastructureServiceDatasetCkan: DatasetService = {
	getDataset,
	getDatasetActivity,
	getDatasets,
	createDataset,
	updateDataset,
	deleteDataset,
	getDatasetsCount
}

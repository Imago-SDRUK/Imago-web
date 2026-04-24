import { env } from '$env/dynamic/private'
import type { DatasetService } from '$lib/server/application/services/dataset'
import { err, ok } from '$lib/server/entities/errors'
import { handleCkanError } from '$lib/server/infrastructure/utils/services/ckan'
import { create, createCkanClient, get, patch, remove } from '$lib/utils/ckan/ckan'
import { getSolrSearchParams } from '$lib/utils/ckan/datasets'

const createDataset: DatasetService['createDataset'] = async ({ data }) => {
	try {
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
			return err(handleCkanError(dataset))
		}
		return ok(dataset.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getDataset: DatasetService['getDataset'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const data = await ckan.request(
			get('package_show', {
				id,
				include_plugin_data: true,
				use_default_schema: true
			})
		)
		if (!data.success) {
			return err(handleCkanError(data))
		}
		return ok(data.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getDatasetsCount: DatasetService['getDatasetsCount'] = async () => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const data = await ckan.request(
			get('package_list', {
				limit: 9999
			})
		)

		if (!data.success) {
			return err(handleCkanError(data))
		}

		return ok(data.result.length)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getDatasets: DatasetService['getDatasets'] = async ({ page_size, offset, search, url }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const limit = page_size
		const fq = getSolrSearchParams(url)
		/**
		 * NOTE: solr endpoint as private and drafts are not available through ckan endpoints
		 **/
		const data = await ckan.request(
			get('package_search', {
				q: search,
				start: offset <= 0 ? 0 : offset,
				rows: limit,
				fq,
				include_private: true,
				include_drafts: true
			})
		)
		if (!data.success) {
			return err(handleCkanError(data))
		}
		const max_pages = Math.floor(data.result.count / page_size)
		const next = offset + 1 > max_pages ? max_pages : offset + 1

		return ok({
			items: data.result.results,
			page_size,
			next: next,
			total: data.result.count
		})
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getDatasetActivity: DatasetService['getDatasetActivity'] = async ({
	id,
	page_size,
	offset
}) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const data = await ckan.request(get('package_activity_list', { id, offset, limit: page_size }))

		if (!data.success) {
			return err(handleCkanError(data))
		}
		return ok(data.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateDataset: DatasetService['updateDataset'] = async ({ id, data }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const dataset = await ckan.request(patch('package_patch', { id }, data))
		if (!dataset.success) {
			return err(handleCkanError(dataset))
		}
		return ok(dataset.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deleteDataset: DatasetService['deleteDataset'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const dataset = await ckan.request(remove('package_delete', { id }))
		if (!dataset.success) {
			return err(handleCkanError(dataset))
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
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

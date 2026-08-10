import { env } from '$env/dynamic/private'
import type { IResourceService } from '$lib/server/application/services/resource'
import { err, ok } from '$lib/server/entities/errors'
import { ckanWrapper, handleCkanError } from '$lib/server/infrastructure/utils/services/ckan'
import { create, createCkanClient, get, patch, remove, update } from '$lib/utils/ckan/ckan'

const getResource: IResourceService['getResource'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(get('resource_show', { id }))
		if (res.success) {
			return ok(res.result)
		}
		return err({ reason: 'Not Found', message: `Not found` })
	} catch (error) {
		return err({ reason: 'Unexpected', error })
	}
}

const getResources: IResourceService['getResources'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(get('resource_show', { id }))

		if (!res.success) {
			return err(handleCkanError(res))
		}
		return ok([res.result])
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const createResource: IResourceService['createResource'] = async ({ data }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})

		const res = await ckan.request(
			create('resource_create', {
				id: data.id,
				url: data.url,
				// url: `${env.ORIGIN}/api/v1/resources/${resource_id}`,
				name: data.name,
				package_id: data.package_id,
				description: data.description,
				format: data.format,
				mimetype: data.mimetype,
				size: data.size
			})
		)

		if (!res.success) {
			return err(handleCkanError(res))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const deleteResource: IResourceService['deleteResource'] = async ({ id }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		const res = await ckan.request(remove('resource_delete', { id }))
		if (!res.success) {
			return err(handleCkanError(res))
		}
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const updateResource: IResourceService['updateResource'] = async ({ id, data }) => {
	try {
		const ckan = createCkanClient({
			url: env.CKAN_URL,
			token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
		})
		// NOTE: ckan requires the id in the body patch
		const res = await ckan.request(patch('resource_patch', { id }, { ...data, id }))
		if (!res.success) {
			return err(handleCkanError(res))
		}
		return ok(res.result)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

export const resourceServiceInfrastructureCkan: IResourceService = {
	createResource,
	deleteResource,
	getResource,
	getResources,
	updateResource
}

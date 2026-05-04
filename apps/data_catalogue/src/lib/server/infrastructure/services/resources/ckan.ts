import { env } from '$env/dynamic/private'
import type { ResourceService } from '$lib/server/application/services/resource'
import { err, ok } from '$lib/server/entities/errors'
import { ckanWrapper, handleCkanError } from '$lib/server/infrastructure/utils/services/ckan'
import { create, createCkanClient, get, remove } from '$lib/utils/ckan/ckan'

const getResource: ResourceService['getResource'] = async ({ id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	return ckanWrapper(() => ckan.request(get('resource_show', { id })))
}

const getResources: ResourceService['getResources'] = async ({ id }) => {
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

const createResource: ResourceService['createResource'] = async ({ data }) => {
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
const deleteResource: ResourceService['deleteResource'] = async ({ id }) => {
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

export const resourceServiceInfrastructureCkan: ResourceService = {
	createResource,
	deleteResource,
	getResource,
	getResources
}

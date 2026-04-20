import { env } from '$env/dynamic/private'
import type { ResourceService } from '$lib/server/application/services/resource'
import { create, createCkanClient, get, remove } from '$lib/utils/ckan/ckan'
import { error } from '@sveltejs/kit'

const getResource: ResourceService['getResource'] = async ({ id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const ckan_resource = await ckan.request(get('resource_show', { id }))
	if (ckan_resource.success) {
		return ckan_resource.result
	}
	error(500, { message: `Error getting the resource`, id: 'err-ckan-resource' })
}

const getResources: ResourceService['getResources'] = async ({ id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const ckan_resource = await ckan.request(get('resource_show', { id }))
	if (ckan_resource.success) {
		return [ckan_resource.result]
	}
	error(500, { message: `Error getting the resource`, id: 'err-ckan-resource' })
}

const createResource: ResourceService['createResource'] = async ({ data }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const ckan_resource = await ckan.request(
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
	if (ckan_resource.success) {
		return ckan_resource.result
	}
	error(500, { message: `Error creating the resource`, id: 'err-ckan-resource' })
}
const deleteResource: ResourceService['deleteResource'] = async ({ id }) => {
	const ckan = createCkanClient({
		url: env.CKAN_URL,
		token: env.CKAN_TOKEN ? env.CKAN_TOKEN : undefined
	})
	const resource = await ckan.request(remove('resource_delete', { id }))
	if (resource.success === false) {
		error(500, { message: `Error deleting the resource ${id}`, id: 'err-ckan-resource' })
	}
	// await ketoWrite.deleteRelationships({ namespace: 'Resource', object: params.id })
}

export const resourceServiceInfrastructureCkan: ResourceService = {
	createResource,
	deleteResource,
	getResource,
	getResources
}

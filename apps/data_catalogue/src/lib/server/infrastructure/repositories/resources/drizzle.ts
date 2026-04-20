import { db } from '$lib/db'
import { resource_versions, resources } from '$lib/db/schema'
import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import { handleDBError } from '$lib/utils/db'
import { error } from '@sveltejs/kit'
import { and, desc, eq } from 'drizzle-orm'

const getResource: ResourceRepository['getResource'] = async ({ id }) => {
	const resource = await db
		.select()
		.from(resources)
		.where(eq(resources.id, id))
		.limit(1)
		.catch(handleDBError('Resource not found'))
	if (resource.length === 1) {
		return resource[0]
	}
	error(404, { message: 'Resource not found', id: '' })
}
const getResourceVersion: ResourceRepository['getResourceVersion'] = async ({ id, version }) => {
	const resource_version = await db
		.select()
		.from(resource_versions)
		.where(and(eq(resource_versions.resource, id), eq(resource_versions.version, version)))
		.orderBy(desc(resource_versions.created_by))
		.limit(1)
		.catch(handleDBError('No version exists for this resource'))
	if (resource_version.length === 1) {
		return resource_version[0]
	}
	error(404, { message: 'Resource version not found', id: '' })
}
const getResources: ResourceRepository['getResources'] = async ({ limit, offset }) => {
	const results = await db
		.select()
		.from(resources)
		.limit(limit)
		.offset(offset)
		.catch(handleDBError('Resource not found'))
	return results
}

const createResource: ResourceRepository['createResource'] = async ({ data }) => {
	const resource = await db
		.insert(resources)
		.values({
			created_by: data.created_by,
			updated_by: data.updated_by,
			title: data.title,
			id: data.id,
			description: data.description
		})
		.returning()
		.catch(handleDBError('Error creating the resource'))
	if (resource.length === 1) {
		return resource[0]
	}
	error(404, { message: 'Error creating the resource', id: '' })
}

const createResourceVersion: ResourceRepository['createResourceVersion'] = async ({ data }) => {
	const resource_version = await db
		.insert(resource_versions)
		.values(data)
		.returning()
		.catch(handleDBError('Error creating the resource'))
	if (resource_version.length === 1) {
		return resource_version[0]
	}
	error(404, { message: 'Error creating the resource', id: '' })
}

const getResourceVersions: ResourceRepository['getResourceVersions'] = async ({ id }) => {
	const versions = await db
		.select()
		.from(resource_versions)
		.where(eq(resource_versions.resource, id))
		.orderBy(desc(resource_versions.created_at))
		.catch(handleDBError('No version exists for this resource'))
	return versions
}

const deleteResource = async ({ id }: { id: string }) => {
	await db
		.delete(resources)
		.where(eq(resources.id, id))
		.catch(handleDBError('Error deleting resource'))
}

const deleteResourceVersion = async ({ id }: { id: string }) => {
	await db
		.delete(resource_versions)
		.where(eq(resource_versions.id, id))
		.catch(handleDBError('Error deleting resource version'))
}

const updateResource: ResourceRepository['updateResource'] = async ({ id, data }) => {
	const resource = await db
		.update(resources)
		.set(data)
		.where(eq(resources.id, id))
		.returning()
		.catch(handleDBError('Error updating resource'))
	if (resource.length === 1) {
		return resource[0]
	}
	error(404, { message: 'Error updating the resource', id: '' })
}

const updateVersion: ResourceRepository['updateVersion'] = async ({ id, data }) => {
	const version = await db
		.update(resource_versions)
		.set(data)
		.where(eq(resource_versions.id, id))
		.returning()
		.catch(handleDBError('Error updating resource version'))
	if (version.length === 1) {
		return version[0]
	}
	error(404, { message: 'Error updating the resource version', id: '' })
}

// const getResourcesByDataset: ResourceRepository['getResourcesByDataset'] = async ({ id }) => {
// 	const results = await db
// 		.select()
// 		.from(resources)
//     .where(eq(resources.dataset))
// 		.catch(handleDBError('Resource not found'))
// 	return results
// }

export const datasetRepositoryInfrastructureDrizzle: ResourceRepository = {
	getResource,
	createResource,
	getResourceVersions,
	getResources,
	getResourceVersion,
	deleteResource,
	createResourceVersion,
	deleteResourceVersion,
	updateResource,
	updateVersion
}

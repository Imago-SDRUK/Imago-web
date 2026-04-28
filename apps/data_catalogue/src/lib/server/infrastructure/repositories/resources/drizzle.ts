import { db } from '$lib/db'
import { resource_versions, resources } from '$lib/db/schema'
import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import { err, ok } from '$lib/server/entities/errors'
import { handleDBError } from '$lib/utils/db'
import { and, desc, eq, sql } from 'drizzle-orm'

const getResource: ResourceRepository['getResource'] = async ({ id }) => {
	try {
		const resource = await db
			.select()
			.from(resources)
			.where(eq(resources.id, id))
			.limit(1)
			.catch(handleDBError('Resource not found'))
		if (resource.length === 1) {
			return ok(resource[0])
		}
		return err({ reason: 'Not Found', message: 'Resource not found' })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const getResourceVersion: ResourceRepository['getResourceVersion'] = async ({
	resource,
	version
}) => {
	try {
		const resource_version = await db
			.select()
			.from(resource_versions)
			.where(and(eq(resource_versions.resource, resource), eq(resource_versions.id, version)))
			.orderBy(desc(resource_versions.created_by))
			.limit(1)
			.catch(handleDBError('No version exists for this resource'))
		if (resource_version.length === 1) {
			return ok(resource_version[0])
		}
		return err({ reason: 'Not Found', message: 'Resource version not found', resource, version })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}
const getResources: ResourceRepository['getResources'] = async ({ limit, offset }) => {
	try {
		const results = await db
			.select()
			.from(resources)
			.limit(limit)
			.offset(offset)
			.catch(handleDBError('Resource not found'))
		return ok(results)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const createResource: ResourceRepository['createResource'] = async ({ data, tx }) => {
	try {
		const _tx = tx ?? db
		const resource = await _tx
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
			return ok(resource[0])
		}
		return err({ reason: 'Unexpected', error: resource })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const createResourceVersion: ResourceRepository['createResourceVersion'] = async ({ data, tx }) => {
	try {
		const _tx = tx ?? db
		const resource_version = await _tx
			.insert(resource_versions)
			.values(data)
			.returning()
			.catch(handleDBError('Error creating the resource'))
		if (resource_version.length === 1) {
			return ok(resource_version[0])
		}
		return err({ reason: 'Unexpected', error: resource_version })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const getResourceVersions: ResourceRepository['getResourceVersions'] = async ({ id }) => {
	try {
		const versions = await db
			.select()
			.from(resource_versions)
			.where(eq(resource_versions.resource, id))
			.orderBy(desc(resource_versions.created_at))
		return ok(versions)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deleteResource: ResourceRepository['deleteResource'] = async ({ id }: { id: string }) => {
	try {
		await db
			.delete(resources)
			.where(eq(resources.id, id))
			.catch(handleDBError('Error deleting resource'))
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const deleteResourceVersion: ResourceRepository['deleteResourceVersion'] = async ({
	id
}: {
	id: string
}) => {
	try {
		await db
			.delete(resource_versions)
			.where(eq(resource_versions.id, id))
			.catch(handleDBError('Error deleting resource version'))
		return ok(null)
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateResource: ResourceRepository['updateResource'] = async ({ id, data, tx }) => {
	try {
		const _tx = tx ?? db
		const resource = await _tx
			.update(resources)
			.set(data)
			.where(eq(resources.id, id))
			.returning()
			.catch(handleDBError('Error updating resource'))
		if (resource.length === 1) {
			return ok(resource[0])
		}
		return err({ reason: 'Unexpected', error: resource })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateVersion: ResourceRepository['updateVersion'] = async ({ id, data, tx }) => {
	try {
		const _tx = tx ?? db
		const version = await _tx
			.update(resource_versions)
			.set(data)
			.where(eq(resource_versions.id, id))
			.returning()
			.catch(handleDBError('Error updating resource version'))
		if (version.length === 1) {
			return ok(version[0])
		}
		return err({ reason: 'Unexpected', error: version })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
}

const updateVersionAddDownload: ResourceRepository['updateVersionAddDownload'] = async ({
	id,
	tx
}) => {
	try {
		const _tx = tx ?? db
		const version = await _tx
			.update(resource_versions)
			.set({
				downloads: sql`${resource_versions.downloads} + 1`
			})
			.where(eq(resource_versions.id, id))
			.returning()
			.catch(handleDBError('Error updating resource version'))
		if (version.length === 1) {
			return ok(version[0])
		}
		return err({ reason: 'Unexpected', error: version })
	} catch (_err) {
		return err({ reason: 'Unexpected', error: _err })
	}
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
	updateVersion,
	updateVersionAddDownload
}

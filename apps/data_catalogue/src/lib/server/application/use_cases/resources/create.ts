import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import type { AppContext } from '$lib/server/application/context'
import type { ResourceService } from '$lib/server/application/services/resource'
import type { StorageService } from '$lib/server/application/services/storage'
import {
	resource_versions,
	resources,
	ResourceServiceRequestSchema,
	type ResourceRequest,
	type ResourceServiceRequest,
	type ResourceVersionRequest
} from '$lib/server/entities/models/resources'
import { err, ok } from '$lib/server/entities/errors'
import { v7 } from 'uuid'
import { type } from 'arktype'
import { createInsertSchema } from 'drizzle-arktype'
import { log } from '$lib/utils/server/logger'

export const resourceCreateUseCase = async ({
	data,
	resource_respository,
	session,
	configuration,
	authorisation_module,
	package_id,
	tx
}: {
	data: Partial<ResourceRequest>
	resource_respository: ResourceRepository
	package_id: string
} & AppContext) => {
	log.trace({ caller: 'resourceCreateUseCase' })
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: package_id,
		permits: 'update',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		log.error({ message: 'Error getting authorisation' })
		return err(errors)
	}
	if (!permission.allowed) {
		log.warn({ message: 'User unauthorised' })
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(resources)
	const validated = schema({
		...data,
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}

	const [errs_resource, result] = await resource_respository.createResource({
		data: validated,
		tx
	})
	if (errs_resource !== null) {
		return err(errs_resource)
	}
	log.trace({ returning: 'resourceCreateUseCase' })
	return ok(result)
}

export const resourceServiceCreateUseCase = async ({
	data,
	resource_service,
	session,
	configuration,
	authorisation_module
}: {
	data: ResourceServiceRequest
	resource_service: ResourceService
} & AppContext) => {
	log.trace({ caller: 'resourceServiceCreateUseCase' })
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: data.package_id,
		permits: 'update',
		actor: session.identity.id,
		configuration
	})

	if (errors) {
		log.error({ message: 'Error getting authorisation' })
		return err(errors)
	}
	if (!permission.allowed) {
		log.warn({ message: 'User unauthorised' })
		return err({ reason: 'Unauthorised' })
	}
	const validated = ResourceServiceRequestSchema(data)
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'invalid-data' })
	}
	const resource_id = v7()
	const [errs, result] = await resource_service.createResource({
		data: { ...validated, id: resource_id }
	})
	if (errs !== null) {
		return err(errs)
	}

	log.trace({ returning: 'resourceServiceCreateUseCase' })
	return ok(result)
}

export const resourceVersionCreateUseCase = async ({
	data,
	resource_respository,
	storage_service,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	data: Partial<ResourceVersionRequest>
	resource_respository: ResourceRepository
	storage_service: StorageService
} & AppContext) => {
	log.trace({ caller: 'resourceVersionCreateUseCase' })
	const schema = createInsertSchema(resource_versions, {
		version: () => type('string.semver')
	})
	const validated = schema({
		...data,
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({
			reason: 'Invalid Data',
			message: validated.summary,
			id: 'resource version validation'
		})
	}
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Resource',
		object: validated.resource,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		log.error({ message: 'Error getting authorisation' })
		return err(errors)
	}
	if (!permission.allowed) {
		log.warn({ message: 'User unauthorised' })
		return err({ reason: 'Unauthorised' })
	}
	const version_id = v7()

	const [errs_resource, resource] = await resource_respository.getResource({
		id: validated.resource
	})
	if (errs_resource !== null) {
		return err(errs_resource)
	}
	const [version_errors, version] = await resource_respository.createResourceVersion({
		data: {
			created_by: session.identity.id,
			updated_by: session.identity.id,
			resource: resource.id,
			version: validated.version,
			id: version_id
		},
		tx
	})
	if (version_errors !== null) {
		return err(version_errors)
	}

	const [errors_p] = await authorisation_module.createPermissions({
		permissions: [
			{
				namespace: 'ResourceVersion',
				object: version.id,
				relation: 'resources',
				actor: {
					namespace: 'Resource',
					object: resource.id,
					relation: ''
				}
			}
		]
	})

	if (errors_p) {
		return err(errors_p)
	}
	const [errs_s, url] = await storage_service.getUploadUrl({ filename: version_id })
	if (errs_s !== null) {
		return err(errs_s)
	}
	return ok(url)
}

// NOTE: this one skips check of existing resource and takes the resource id from the incoming data
export const resourceVersionPipelineCreateUseCase = async ({
	data,
	resource_respository,
	storage_service,
	session,
	configuration,
	authorisation_module,
	tx
}: {
	data: Partial<ResourceVersionRequest>
	resource_respository: ResourceRepository
	storage_service: StorageService
} & AppContext) => {
	log.trace({ caller: 'resourceVersionCreateUseCase' })
	const schema = createInsertSchema(resource_versions, {
		version: () => type('string.semver')
	})
	const validated = schema({
		...data,
		created_by: session.identity.id,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({
			reason: 'Invalid Data',
			message: validated.summary,
			id: 'resource version validation'
		})
	}
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Resource',
		object: validated.resource,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		log.error({ message: 'Error getting authorisation' })
		return err(errors)
	}
	if (!permission.allowed) {
		log.warn({ message: 'User unauthorised' })
		return err({ reason: 'Unauthorised' })
	}
	const version_id = v7()

	const [version_errors, version] = await resource_respository.createResourceVersion({
		data: {
			created_by: session.identity.id,
			updated_by: session.identity.id,
			resource: validated.resource,
			version: validated.version,
			id: version_id
		},
		tx
	})

	if (version_errors !== null) {
		return err(version_errors)
	}

	const [errors_p] = await authorisation_module.createPermissions({
		permissions: [
			{
				namespace: 'ResourceVersion',
				object: version.id,
				relation: 'resource',
				actor: validated.resource
			}
		]
	})
	if (errors_p) {
		return err(errors_p)
	}
	const [errs_s, url] = await storage_service.getUploadUrl({ filename: version_id })
	if (errs_s !== null) {
		return err(errs_s)
	}
	return ok({ version, url })
}

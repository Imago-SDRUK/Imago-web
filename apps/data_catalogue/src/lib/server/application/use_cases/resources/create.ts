import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import type { ResourceService } from '$lib/server/application/services/resource'
import type { StorageService } from '$lib/server/application/services/storage'
import type { ResourceServiceRequest } from '$lib/server/entities/models/resources'
import { err, ok } from '$lib/server/entities/errors'
import { v7 } from 'uuid'
import type { AppContext } from '$lib/server/application/context'

export const resourceCreateUseCase = async ({
	data,
	resource_respository,
	resource_service,
	session,
	configuration,
	authorisation_module
}: {
	data: ResourceServiceRequest
	resource_respository: ResourceRepository
	resource_service: ResourceService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Action',
		object: 'resources',
		permits: 'create',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const resource_id = v7()
	const [errs, resource_metadata] = await resource_service
		.createResource({
			data: { ...data, id: resource_id }
		})
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errs !== null) {
		return err(errs)
	}
	const [errs_resource, result] = await resource_respository
		.createResource({
			data: {
				created_by: session.identity.id,
				updated_by: session.identity.id,
				title: resource_metadata.name,
				description: resource_metadata.description,
				id: resource_id
			}
		})
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errs_resource !== null) {
		return err(errs_resource)
	}
	const [errors_p] = await authorisation_module.createPermissions({
		permissions: [
			{ namespace: 'Resource', object: resource_id, relation: 'datasets', actor: data.package_id }
		]
	})
	if (errors_p) {
		return err(errors_p)
	}
	return ok(result)
}

export const resourceVersionCreateUseCase = async ({
	version,
	resource_id,
	resource_respository,
	storage_service,
	session,
	configuration,
	authorisation_module
}: {
	version: string
	resource_id: string
	resource_respository: ResourceRepository
	storage_service: StorageService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Resource',
		object: resource_id,
		permits: 'edit',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const version_id = v7()
	const [errs_resource, resource] = await resource_respository
		.getResource({ id: resource_id })
		.then(([errors, data]) => {
			if (errors !== null) {
				return err(errors)
			}
			return ok(data)
		})
	if (errs_resource !== null) {
		return err(errs_resource)
	}
	const [errs_version] = await resource_respository
		.createResourceVersion({
			data: {
				created_by: session.identity.id,
				updated_by: session.identity.id,
				resource: resource.id,
				version: version,
				id: version_id
			}
		})
		.then(([errors, data]) => {
			if (errors !== null) {
				return err(errors)
			}
			return ok(data)
		})
	if (errs_version !== null) {
		return err(errs_version)
	}
	const [errors_p] = await authorisation_module.createPermissions({
		permissions: [
			{ namespace: 'ResourceVersion', object: version_id, relation: 'resource', actor: resource_id }
		]
	})
	if (errors_p) {
		return err(errors_p)
	}
	const [errs_s, url] = await storage_service.getDownloadUrl({ filename: version_id })
	if (errs_s !== null) {
		return err(errs_s)
	}
	return ok(url)
}

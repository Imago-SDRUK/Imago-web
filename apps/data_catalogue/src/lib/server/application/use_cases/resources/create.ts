import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import type { ResourceService } from '$lib/server/application/services/resource'
import type { StorageService } from '$lib/server/application/services/storage'
import { err, ok } from '$lib/server/entities/errors'
import type { Session } from '$lib/server/entities/models/identity'
import type { ResourceServiceRequest } from '$lib/server/entities/models/resources'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'
import { v7 } from 'uuid'

export const resourceCreateUseCase = async ({
	data,
	resource_respository,
	resource_service,
	session
}: {
	data: ResourceServiceRequest
	resource_respository: ResourceRepository
	resource_service: ResourceService
	session: Session
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		namespace: 'Action',
		object: 'resources',
		permits: 'create',
		actor: session.identity.id
		// action: () => redirect(307, '/auth/login')
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
	return ok(result)
}

export const resourceVersionCreateUseCase = async ({
	version,
	resource_id,
	resource_respository,
	storage_service,
	session
}: {
	version: string
	resource_id: string
	resource_respository: ResourceRepository
	storage_service: StorageService
	session: Session
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		namespace: 'Action',
		object: 'resources',
		permits: 'create',
		actor: session.identity.id
		// action: () => redirect(307, '/auth/login')
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
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
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
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errs_version !== null) {
		return err(errs_version)
	}
	return await storage_service
		.getDownloadUrl({ filename: version_id })
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
}

import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import type { Session } from '$lib/server/entities/models/identity'
import type { ResourceRequest, ResourceVersionRequest } from '$lib/server/entities/models/resources'
import { err, ok } from '$lib/server/entities/errors'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const resourceUpdateUseCase = async ({
	resource_id,
	data,
	resource_respository,
	session
}: {
	resource_id: string
	data: Partial<ResourceRequest>
	resource_respository: ResourceRepository
	session: Session
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		namespace: 'Resource',
		object: resource_id,
		permits: 'edit',
		actor: session.identity.id
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, resource] = await resource_respository
		.updateResource({
			data,
			id: resource_id
		})
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errs !== null) {
		return err(errs)
	}
	return ok(resource)
}

export const resourceVersionUpdateUseCase = async ({
	version_id,
	data,
	resource_respository,
	session
}: {
	version_id: string
	data: Partial<ResourceVersionRequest>
	resource_respository: ResourceRepository
	session: Session
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		namespace: 'ResourceVersion',
		object: version_id,
		permits: 'edit',
		actor: session.identity.id
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, resource_version] = await resource_respository
		.updateVersion({ id: version_id, data })
		.then((res) => ok(res))
		.catch((_err) => err({ reason: 'Unexpected', error: _err }))
	if (errs !== null) {
		return err(errs)
	}
	return ok(resource_version)
}

export const resourceVersionUpdateFileUseCase = async ({
	version_id,
	data,
	resource_respository,
	session
}: {
	version_id: string
	data: Partial<ResourceVersionRequest>
	resource_respository: ResourceRepository
	session: Session
}) => {
	const [errors, permission] = await getAuthorisationModule().authorise({
		namespace: 'ResourceVersion',
		object: version_id,
		permits: 'edit',
		actor: session.identity.id
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [errs, resource_version] = await resource_respository.updateVersion({
		id: version_id,
		data
	})
	if (errs !== null) {
		return err(errs)
	}
	return ok(resource_version)
}

import type { ResourceRepository } from '$lib/server/application/repositories/resource'
import type { ResourceRequest, ResourceVersionRequest } from '$lib/server/entities/models/resources'
import { err, ok } from '$lib/server/entities/errors'
import type { AppContext } from '$lib/server/application/context'

export const resourceUpdateUseCase = async ({
	resource_id,
	data,
	resource_respository,
	session,
	authorisation_module,
	configuration
}: {
	resource_id: string
	data: Partial<ResourceRequest>
	resource_respository: ResourceRepository
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
	session,
	authorisation_module,
	configuration
}: {
	version_id: string
	data: Partial<ResourceVersionRequest>
	resource_respository: ResourceRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'ResourceVersion',
		object: version_id,
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
	session,
	authorisation_module,
	configuration
}: {
	version_id: string
	data: Partial<ResourceVersionRequest>
	resource_respository: ResourceRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'ResourceVersion',
		object: version_id,
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

	const [errs, resource_version] = await resource_respository.updateVersion({
		id: version_id,
		data
	})
	if (errs !== null) {
		return err(errs)
	}
	return ok(resource_version)
}

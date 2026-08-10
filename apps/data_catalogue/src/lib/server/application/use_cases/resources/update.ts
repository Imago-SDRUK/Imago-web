import type { IResourceRepository } from '$lib/server/application/repositories/resource'
import {
	resource_versions,
	ResourceServiceRequestSchema,
	type ResourceRequest,
	type ResourceServiceRequest,
	type ResourceVersionRequest
} from '$lib/server/entities/models/resources'
import { err, ok } from '$lib/server/entities/errors'
import type { AppContext } from '$lib/server/application/context'
import { createUpdateSchema } from 'drizzle-arktype'
import { type } from 'arktype'
import type { IResourceService } from '$lib/server/application/services/resource'

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
	resource_respository: IResourceRepository
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
	resource_respository: IResourceRepository
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
	const schema = createUpdateSchema(resource_versions, {
		version: () => type('string.semver')
	})
	const validated = schema({
		...data,
		updated_by: session.identity.id
	})
	if (validated instanceof type.errors) {
		return err({
			reason: 'Invalid Data',
			message: validated.summary,
			id: 'resource version validation'
		})
	}

	const [errs, resource_version] = await resource_respository
		.updateVersion({ id: version_id, data: validated })
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
	resource_respository: IResourceRepository
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

export const resourceServiceUpdateUseCase = async ({
	id,
	data,
	resource_service,
	session,
	authorisation_module,
	configuration
}: {
	id: string
	data: Partial<ResourceServiceRequest>
	resource_service: IResourceService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Resource',
		object: id,
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
	const validated = ResourceServiceRequestSchema.omit('package_id')(data)
	if (validated instanceof type.errors) {
		return err({
			reason: 'Invalid Data',
			message: validated.summary,
			id: 'resource version validation'
		})
	}
	const res = await resource_service.updateResource({ data: validated, id })
	return ok(res)
}

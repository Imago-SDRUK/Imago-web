import type { AppContext } from '$lib/server/application/context'
import type { GroupsRepository } from '$lib/server/application/repositories/groups'
import type { UsersRepository } from '$lib/server/application/repositories/users'
import type { DatasetService } from '$lib/server/application/services/dataset'
import type { IdentityService } from '$lib/server/application/services/identity'
import { permissionsGetUseCase } from '$lib/server/application/use_cases/permissions/get'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import type { PermissionActor, Relationship } from '$lib/server/entities/models/permissions'
import type { User } from '$lib/server/entities/models/users'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const datasetGetPublicUseCase = async ({
	id,
	dataset_service
}: {
	id: string
	dataset_service: DatasetService
}) => {
	const [errors, dataset] = await dataset_service.getDataset({ id })
	if (errors !== null) {
		return err(errors)
	}
	if (dataset?.private === false) {
		return ok({ data: dataset })
	}
	return err({ reason: 'Not Found' })
}

export const datasetGetUseCase = async ({
	id,
	dataset_service,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	dataset_service: DatasetService
} & AppContext) => {
	//NOTE: id lookup must be perfomed before auth
	const [dataset_errors, dataset] = await dataset_service.getDataset({ id })
	if (dataset_errors) {
		return err(dataset_errors)
	}
	if (!dataset) {
		return err({ reason: 'Not Found' })
	}
	const [errors, allowed] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: dataset.id,
		permits: 'read',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!allowed.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, permission] = await authorisation_module.getPermissions({
		namespace: 'Dataset',
		object: dataset.id,
		actor: session.identity.id
	})

	return ok(dataset)
}

export const datasetsGetPaginatedUseCase = async ({
	url,
	dataset_service,
	page_size = 10,
	offset = 0,
	search,
	session,
	configuration,
	authorisation_module
}: {
	url: URL
	dataset_service: DatasetService
	page_size?: number
	offset?: number
	search?: string
} & AppContext) => {
	// const [errors, allowed] = await getAuthorisationModule().authorise({
	// 	namespace: 'Action',
	// 	object: 'datasets',
	// 	permits: 'read',
	// 	actor: session.identity.id
	// })
	// if (errors !== null) {
	// 	return err(errors)
	// }
	// if (!allowed.allowed) {
	// 	return err({ reason: 'Unauthorised' })
	// }
	const [errs, datasets] = await dataset_service.getDatasets({
		page_size: page_size,
		offset: offset,
		url,
		search
	})
	if (errs) {
		return err(errs)
	}
	if (!datasets) {
		return err({ reason: 'Not Found' })
	}
	const permissions = await Promise.all(
		datasets.items.map((dataset) =>
			authorisation_module
				.authorise({
					actor: session.identity.id,
					namespace: 'Dataset',
					object: dataset.id,
					permits: 'read',
					configuration
				})
				.then(([errors, permission]) => {
					if (errors !== null) {
						return null
					}
					if (permission.allowed) {
						return dataset.id
					}
					return null
				})
		)
	)
	return ok({
		...datasets,
		items: datasets.items.filter((dataset) => permissions.includes(dataset.id))
	})
}

export const datasetsGetPaginatedPublicUseCase = async ({
	url,
	dataset_service,
	page_size = 10,
	offset = 0,
	search
}: {
	url: URL
	dataset_service: DatasetService
	page_size?: number
	offset?: number
	search?: string
}) => {
	const [errs, datasets] = await dataset_service.getDatasets({
		page_size: page_size,
		offset: offset,
		url,
		search
	})
	if (errs) {
		return err(errs)
	}
	if (!datasets) {
		return err({ reason: 'Not Found' })
	}
	const filtered = datasets.items.filter((dataset) => dataset.private === false)
	return ok({ ...datasets, items: filtered })
}

export const datasetGetActivityUseCase = async ({
	id,
	offset = 0,
	page_size = 10,
	dataset_service,
	session,
	configuration,
	authorisation_module
}: {
	id: string
	offset?: number
	page_size?: number
	dataset_service: DatasetService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: id,
		permits: 'read',
		actor: session.identity.id,
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err(errors ?? { reason: 'Unauthorised' })
	}
	const [errs, activity] = await dataset_service.getDatasetActivity({ id, offset, page_size })
	if (errs) {
		return err(errs)
	}
	return ok(activity)
}

export const datasetGetActivityPublicUseCase = async ({
	id,
	offset = 0,
	page_size = 10,
	dataset_service
}: {
	id: string
	offset?: number
	page_size?: number
	dataset_service: DatasetService
}) => {
	const [errors, activity] = await dataset_service.getDatasetActivity({ id, offset, page_size })
	if (errors !== null) {
		return err(errors)
	}
	const filtered = activity.filter((dataset) => dataset.data.package.private === false)
	return ok(filtered)
}

export const datasetsCountGetPublicUseCase = async ({
	dataset_service
}: {
	dataset_service: DatasetService
}) => {
	const [errors, count] = await dataset_service.getDatasetsCount()
	if (errors !== null) {
		return err(errors)
	}
	return ok(count)
}

export const datasetGetPermissionsUseCase = async ({
	session,
	id,
	groups_repository,
	identity_service,
	users_repository,
	configuration,
	authorisation_module
}: {
	id: string
	groups_repository: GroupsRepository
	identity_service: IdentityService
	users_repository: UsersRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Dataset',
		object: id,
		permits: 'share',
		actor: session.identity.id,
		configuration
	})

	if (errors !== null) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err(errors ?? { reason: 'Unauthorised' })
	}
	const [p_errors, permissions] = await permissionsGetUseCase({
		session,
		data: {
			namespace: 'Dataset',
			object: id
		},
		configuration,
		authorisation_module
	})
	const sorted_permissions = permissions?.relation_tuples?.reduce(
		(acc, el) => {
			if (el.subject_id) {
				acc.users.push(el)
				return acc
			}
			if (el.subject_set) {
				acc.groups.push(el)
				return acc
			}
			return acc
		},
		{
			groups: [],
			users: []
		} as {
			groups: Relationship[]
			users: Relationship[]
		}
	)
	if (p_errors !== null) {
		return err(p_errors)
	}
	const [groups_err, groups] = await groups_repository.getGroupsById({
		limit: 999,
		offset: 0,
		ids:
			sorted_permissions?.groups
				.map((permission) => permission.subject_set?.object)
				.filter((x) => x !== undefined) ?? []
	})

	if (groups_err !== null) {
		return err(groups_err)
	}

	const [users_err, users] = await users_repository.getUsersById({
		limit: 999,
		offset: 0,
		ids:
			sorted_permissions?.users
				.map((permission) => permission.subject_id)
				.filter((x) => x !== undefined)
				.filter((x) => x !== 'anonymous') ?? []
	})
	if (users_err !== null) {
		return err(users_err)
	}

	const identities = await Promise.all(
		users.items.map((user) =>
			identity_service.getIdentity({ id: user.id }).then(([errors, identity]) => {
				if (errors !== null) {
					if (errors.reason === 'Not Found') {
						return ok(null)
					}
					return err(errors)
				}

				return ok({
					...user,
					email: identity?.email,
					first_name: identity?.first_name,
					last_name: identity?.last_name
				})
			})
		)
	)

	const users_identities = identities.reduce(
		(acc, [errors, resource]) => {
			if (errors !== null) {
				acc.errors.push(errors)
			}
			if (resource !== null) {
				acc.users.push(resource)
			}
			return acc
		},
		{ errors: [], users: [] } as {
			errors: ErrTypes[]
			users: (User & { first_name?: string; last_name?: string; email?: string })[]
		}
	)
	if (users_identities.errors.length > 0) {
		return err(users_identities.errors[0])
	}
	//NOTE: maybe split actors into each usecase
	const parsed_groups: PermissionActor[] = sorted_permissions?.groups.map((_g) => {
		const group = groups.find((g) => g.id === _g.subject_set?.object)
		return {
			label: `${group?.title} - ${_g.subject_set?.relation}`,
			actor: _g.subject_set,
			relation: _g.relation
		}
	})
	const parsed_users: PermissionActor[] = sorted_permissions?.users.map((_u) => {
		if (_u.subject_id === 'anonymous') {
			return {
				label: 'Public',
				actor: _u.subject_id,
				relation: _u.relation
			}
		}
		const user = users_identities.users.find((u) => u.id === _u.subject_id)
		return {
			label: String(user?.email),
			actor: _u.subject_id,
			relation: _u.relation
		}
	})
	const parsed: PermissionActor[] = [...(parsed_groups ?? []), ...(parsed_users ?? [])]

	return ok(parsed)
}

export const datasetGetUserPermissionsUseCase = async ({
	id,
	session,
	configuration
}: {
	id: string
} & AppContext) => {
	const auth_module = getAuthorisationModule()
	const permits = ['read', 'edit', 'delete', 'share']
	const allowed = await Promise.all(
		permits.map((permit) =>
			auth_module
				.authorise({
					namespace: 'Dataset',
					object: id,
					permits: permit,
					actor: session.identity.id,
					configuration
				})
				.then(([errors, permission]) => {
					if (errors !== null) {
						return err(errors)
					}
					return ok({ ...permission, permits: permit })
				})
		)
	)

	const parsed = allowed.reduce(
		(acc, [errors, permission]) => {
			if (errors !== null) {
				acc.errors.push(errors)
				return acc
			}
			if (permission.allowed) {
				acc.permission.push(permission.permits)
			}
			return acc
		},
		{ errors: [], permission: [] } as {
			errors: ErrTypes[]
			permission: string[]
		}
	)
	if (parsed.errors.length > 0) {
		return err(parsed.errors[0])
	}
	return ok(parsed.permission)
}

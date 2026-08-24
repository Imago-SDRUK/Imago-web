import type { IQuestionsRepository } from '$lib/server/application/repositories/questions'
import { err, ok, type ErrTypes } from '$lib/server/entities/errors'
import type { AppContext } from '$lib/server/application/context'
import type { Configuration } from '$lib/server/entities/models/configuration'
import type { IUsersRepository } from '$lib/server/application/repositories/users'
import type { IIdentityService } from '$lib/server/application/services/identity'
import type { User } from '$lib/server/entities/models/users'
import type { IGroupsRepository } from '$lib/server/application/repositories/groups'
import type { IDatasetService } from '$lib/server/application/services/dataset'

export const applicationCheckPermissionUseCase = async ({
	object,
	permits,
	configuration,
	session,
	authorisation_module
}: {
	object?: string
	permits?: 'read' | 'manage'
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		object,
		permits,
		actor: session.identity.id,
		namespace: 'Application',
		configuration
	})
	if (errors !== null) {
		return err(errors)
	}
	return ok(permission.allowed)
}

export const applicationGetQuestionsUseCase = async ({
	limit = 50,
	offset = 0,
	session,
	questions_repository,
	authorisation_module,
	configuration
}: {
	limit?: number
	offset?: number
	questions_repository: IQuestionsRepository
	session: App.Locals['session']
	configuration: Configuration
} & AppContext) => {
	const [allowed_errors, allowed] = await authorisation_module.authorise({
		namespace: 'Application',
		object: 'registration',
		permits: 'read',
		actor: session.identity.id,
		configuration
	})
	if (allowed_errors !== null) {
		return err(allowed_errors)
	}
	if (!allowed.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, questions] = await questions_repository.getQuestions({ limit, offset })
	if (errs !== null) {
		return err(errs)
	}
	return ok(questions)
}

export const applicationGetUsersUseCase = async ({
	limit = 25,
	offset = 0,
	user_repository,
	identity_service,
	session,
	configuration,
	authorisation_module
}: {
	limit?: number
	offset?: number
	user_repository: IUsersRepository
	identity_service: IIdentityService
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Application',
		object: 'users',
		permits: 'read',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
	const [errs, users] = await user_repository.getUsers({ limit, offset })
	if (errs !== null) {
		return err(errs)
	}
	if (!users) {
		return err({ reason: 'Unexpected', error: users })
	}
	const users_identities = await Promise.all(
		users.items.map((user) =>
			identity_service.getIdentity({ id: user.id }).then(([errors, data]) => {
				if (errors !== null) {
					if (errors.reason === 'Not Found') {
						return ok({ ...user })
					}
					return err(errors)
				}
				return ok({ ...user, ...data })
			})
		)
	)
	const joined = users_identities.reduce(
		(acc, [errors, user]) => {
			if (errors !== null) {
				acc.errors.push(errors)
				return acc
			}
			acc.identities.push(user)
			return acc
		},
		{ errors: [], identities: [] } as {
			errors: ErrTypes[]
			identities: (User & { first_name?: string; last_name?: string })[]
		}
	)
	if (joined.errors.length > 0) {
		return err(joined.errors[0])
	}
	return ok({ ...users, items: joined.identities })
}

export const applicationGetGroupsUseCase = async ({
	session,
	groups_repository,
	authorisation_module,
	configuration
}: {
	groups_repository: IGroupsRepository
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Application',
		object: 'groups',
		permits: 'read',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}

	const [rg_errors, groups] = await groups_repository.getGroups({
		limit: 1000,
		offset: 0
	})
	if (rg_errors !== null) {
		return err(rg_errors)
	}
	return ok(groups)
}

export const applicationGetDatasetsPaginatedUseCase = async ({
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
	dataset_service: IDatasetService
	page_size?: number
	offset?: number
	search?: string
} & AppContext) => {
	const [errors, permission] = await authorisation_module.authorise({
		namespace: 'Application',
		object: 'datasets',
		permits: 'read',
		actor: session.identity.id,
		configuration
	})
	if (errors) {
		return err(errors)
	}
	if (!permission.allowed) {
		return err({ reason: 'Unauthorised' })
	}
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
		return err({ reason: 'Not Found', message: 'There are no datasets available' })
	}

	return ok({
		...datasets,
		page_size: page_size,
		max_pages: datasets.total / page_size,
		next: offset + 1 > datasets.total ? datasets.total : offset + 1
	})
}

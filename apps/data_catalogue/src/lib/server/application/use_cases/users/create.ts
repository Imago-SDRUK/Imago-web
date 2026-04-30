import type { UsersRepository } from '$lib/server/application/repositories/users'
import type { AppContext } from '$lib/server/application/context'
import { err, ok } from '$lib/server/entities/errors'
import { createInsertSchema } from 'drizzle-arktype'
import { type } from 'arktype'
import { users, type UserRequest } from '$lib/server/entities/models/users'
import { env } from '$env/dynamic/private'
import { log } from '$lib/utils/server/logger'

export const userCreateUseCase = async ({
	payload,
	repository,
	authorisation_module,
	identity_token
}: {
	payload: UserRequest
	repository: UsersRepository
} & AppContext) => {
	if (identity_token !== env.IDENTITY_TOKEN) {
		return err({ reason: 'Unauthorised' })
	}
	const schema = createInsertSchema(users)
	const validated = schema({ ...payload, status: 'preregister' })
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary, id: 'error creating user' })
	}
	const { id, preferences, groups, status } = validated
	const [errors, user] = await repository.createUser({
		data: { id, preferences, groups, status }
	})
	if (errors !== null) {
		log.error({ errors, message: 'Error creating user' })
		return err(errors)
	}
	const [err_p] = await authorisation_module.createPermissions({
		permissions: [{ namespace: 'User', object: user.id, relation: 'members', actor: user.id }]
	})
	if (err_p !== null) {
		return err(err_p)
	}
	return ok(user)
}

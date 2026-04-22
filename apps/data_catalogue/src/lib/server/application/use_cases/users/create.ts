import { users, type UserRequest } from '$lib/server/entities/models/users'
import type { UsersRepository } from '$lib/server/application/repositories/users'
import { err, ok } from '$lib/server/entities/errors'
import { createInsertSchema } from 'drizzle-arktype'
import { type } from 'arktype'
import { getAuthorisationModule } from '$lib/server/modules/authorisation'

export const userCreateUseCase = async ({
	payload,
	repository
}: {
	payload: UserRequest
	repository: UsersRepository
}) => {
	const auth_service = getAuthorisationModule()
	const schema = createInsertSchema(users)
	const validated = schema(payload)
	if (validated instanceof type.errors) {
		return err({ reason: 'Invalid Data', message: validated.summary })
	}
	const { id, preferences, groups, status } = validated
	const [errors, user] = await repository.createUser({
		data: { id, preferences, groups, status }
	})
	if (errors !== null) {
		return err(errors)
	}
	const [err_p] = await auth_service.createPermissions({
		permissions: [{ namespace: 'User', object: user.id, relation: 'members', actor: user.id }]
	})
	if (err_p !== null) {
		return err(err_p)
	}
	return ok(user)
}

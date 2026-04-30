import type { UsersRepository } from '$lib/server/application/repositories/users'
import { DateTime } from 'luxon'

const drizzleCreateUser: UsersRepository['createUser'] = async () => {
	return {
		id: '',
		status: 'draft',
		created_at: DateTime.now().toJSDate(),
		deleted_at: DateTime.now().toJSDate(),
		preferences: null,
		updated_at: DateTime.now().toJSDate()
	}
}

export const userRepositoryInfrastructureTest: UsersRepository = {
	createUser: drizzleCreateUser
}

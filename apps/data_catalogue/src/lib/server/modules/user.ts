import { env } from '$env/dynamic/private'
import { userRepositoryInfrastructure } from '$lib/server/infrastructure/repositories/users'

export const getUserModule = () => {
	if (env.NODE_ENV === 'test') {
		return userRepositoryInfrastructure['test']
	}
	return userRepositoryInfrastructure['drizzle']
}
